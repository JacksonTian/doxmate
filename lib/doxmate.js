var fs = require('fs');
var path = require('path');
var ejs = require('ejs');
var markdown = require('marked').parse;
var dox = require('dox');
var ncp = require('ncp').ncp;

var templates;
var getTemplates = function (skin, input) {
  if (templates) {
    return templates;
  }
  var section;
  var api;
  var doc;
  var configure;
  if (input) {
    section = fs.readFileSync(path.join(input + '/section.html'), 'utf8');
    api = fs.readFileSync(path.join(input + '/api.html'), 'utf8');
    doc = fs.readFileSync(path.join(input + '/doc.html'), 'utf8');
    configure = require(path.join(input + '/doxmate.json'));
  } else {
    section = fs.readFileSync(path.join(__dirname, '../templates/' + skin + '/section.html'), 'utf8');
    api = fs.readFileSync(path.join(__dirname, '../templates/' + skin + '/api.html'), 'utf8');
    doc = fs.readFileSync(path.join(__dirname, '../templates/' + skin + '/doc.html'), 'utf8');
    configure = require(path.join(__dirname, '../templates/' + skin + '/doxmate.json'));
  }

  templates = {
    'section': section,
    'api': api,
    'doc': doc,
    'configuration': configure
  };
  return templates;
};

var types = {
  "param": "参数",
  "example": "示例",
  "return": "返回",
  "method": "方法",
  "api": "可见度",
  "property": "属性",
  "function": "函数",
  "declaration": "声明"
};

var getAPIs = function (basedir, folder, option) {
  var apis = {};
  var options = option || {};
  var files;
  // 读取目录
  try {
    files = fs.readdirSync(basedir);
  } catch (e) {
    return apis;
  }
  // 获取JS文件列表
  files.filter(function (item) {
    return path.extname(item) === '.js';
  })
    // 迭代JS文件，获取注解，生成文档片段
  .forEach(function (file) {
    var basename = path.basename(file, '.js');
    basename = folder ? folder + '/' + basename : basename;
    var buf = fs.readFileSync(path.join(basedir, file), 'utf8');
    var obj = dox.parseComments(buf, {});
    apis[basename] = {types: types, comments: obj, basename: basename, options: options};
  });

  return apis;
};

var getFolders = function (basedir, options) {
  var map = {};
  var files;
  // 读取目录
  try {
    files = fs.readdirSync(basedir);
  } catch (e) {
    return map;
  }
  // 过滤出目录列表
  files.filter(function (item) {
    var stat = fs.statSync(path.join(basedir, item));
    return stat.isDirectory();
  })
    // 迭代目录
  .forEach(function (folder) {
    map[folder] = getAPIs(path.join(basedir, folder), folder, options);
  });

  return map;
};

var getReadme = function (folder) {
  var content = fs.readFileSync(path.join(folder, 'README.md'), 'utf8');
  var indexs = exports.getIndexs(content, 2, function (item) {
    return item.level > 1;
  });
  return {content: markdown(content), indexs: indexs};
};

var getDocs = function (folder) {
  var docs = {};
  var docPath = path.join(folder, 'doc');
  var exists = fs.existsSync(docPath);
  if (!exists) {
    return docs;
  }
  fs.readdirSync(docPath).filter(function (item) {
    return path.extname(item) === '.md';
  }).map(function (item) {
      return path.basename(item, '.md');
  }).forEach(function (doc) {
      docs[doc] = fs.readFileSync(path.join(docPath, doc + '.md'), 'utf8');
  });
  return docs;
};

/**
 * 从Markdown中提取标题列表
 * @return {Array} 返回标题列表
 */
exports.getIndexs = function (section, level, filter) {
  level = level || 3; // 默认抽取到三级标题
  level = level > 6 ? 6 : level; // 最大到6级标题
  level = level < 1 ? 1 : level; // 最小到1级标题
  filter = filter || function (item) {
    return true;
  };
  var matched = section.match(/.*\r?\n(\=+)|#+\s+(.*)/gm);
  if (matched) {
    return matched.map(function (item) {
      if (/#+/.test(item)) {
        var level = item.match(/#+/)[0].length;
        var title = item.replace(/#+\s+/, '');
        return {level: level, title: title};
      } else {
        return {level: 1, title: item.split(/\n/)[0]};
      }
    }).filter(function (item) {
        return item.level <= level;
    }).filter(filter);
  } else {
    return [];
  }
};

/**
 * doxmate的版本号
 */
exports.version = require('../package.json').version;

/**
 * 处理目录，生成文档
 * @param {String} input 输入目录路径
 * @param {String} output 输出目录路径
 */
exports.process = function (input, output, skin) {
  var obj = require(path.resolve(input, 'package.json'));

  var themeDir;

  if (fs.existsSync(path.resolve(input, 'doxmate-templates/' + skin))) {
    themeDir = path.resolve(input, 'doxmate-templates/' + skin);
    obj.options = getTemplates(skin, themeDir).configuration;
  } else {
    obj.options = getTemplates(skin).configuration;
  }

  //代码所在目录
  var libDir = path.join(input, 'lib');

  if (themeDir) {
    obj.filename = path.join(themeDir + '/index.html');
  } else {
    obj.filename = path.join(__dirname, '../templates/' + skin + '/index.html');
  }

  //代码文档
  obj.docs = getDocs(input);

  //用dox 将文件中jsdoc注释转换成json
  obj.apis = getAPIs(libDir, null, obj.options);

  //主题配置文件
  var section = getTemplates(skin).section;
  var folders = getFolders(libDir, obj.options);
  for (var folder in folders) {
    for (var key in folders[folder]) {
      obj.apis[key] = folders[folder][key];
    }
  }

  Object.keys(obj.apis).forEach(function (key) {
    obj.apis[key] = ejs.render(section, obj.apis[key]);
  });

  if (Object.keys(obj.apis).length) {
    // generate api
    var api = getTemplates(skin).api;
    fs.writeFileSync(path.join(output, 'api.html'), ejs.render(api, obj), 'utf8');
  }

  // generate homepage
  var doc = getTemplates(skin).doc;
  var readme = getReadme(input);
  obj.content = readme.content;
  obj.indexs = readme.indexs;
  fs.writeFileSync(path.join(output, 'index.html'), ejs.render(doc, obj), 'utf8');

  // generate docs
  Object.keys(obj.docs).forEach(function (key) {
    obj.content = markdown(obj.docs[key]);
    obj.indexs = exports.getIndexs(obj.docs[key]);
    fs.writeFileSync(path.join(output, key + '.html'), ejs.render(doc, obj), 'utf8');
  });

  // copy styles
  ncp(path.join(__dirname, '../templates/' + skin + '/assets'), path.join(output, 'assets'), function () {});
};

/**
 * 显示所有主题列表
 */
exports.list = function () {
  var themeFiles = fs.readdirSync(path.join(__dirname, '../templates/'));
  return themeFiles.join('\n');
};

/**
 * 导出模板
 */
exports.export = function (skin, callback) {
  var outputTheme = path.resolve('./doxmate-templates/');
  var outputThemeDirExists = fs.existsSync(outputTheme);
  if (!outputThemeDirExists) {
    fs.mkdirSync(outputTheme, '0777');
  }
  // copy theme templates
  ncp(path.join(__dirname, '../templates/' + skin + '/'), path.join('./doxmate-templates/', skin), callback);
};

// TODO: 支持主题下载
exports.install = function (url) {
  return 'Coming soon.';
};
