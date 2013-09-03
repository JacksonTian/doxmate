var fs = require('fs');
var path = require('path');

var ejs = require('ejs');
var markdown = require('marked').parse;
var dox = require('dox');
var ncp = require('ncp').ncp;
var env = require('./env.js');

var templates;
var getTemplates = function (skin) {
  if (templates) {
    return templates;
  }
  var section = fs.readFileSync(path.join(__dirname, '../templates/' + skin + '/section.html'), 'utf8');
  var api = fs.readFileSync(path.join(__dirname, '../templates/' + skin + '/api.html'), 'utf8');
  var doc = fs.readFileSync(path.join(__dirname, '../templates/' + skin + '/doc.html'), 'utf8');

  templates = {
    'section': section,
    'api': api,
    'doc': doc
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

var getAPIs = function (basedir, folder) {
  var apis = {};
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
    apis[basename] = {types: types, comments: obj, basename: basename};
  });

  return apis;
};

var getFolders = function (basedir) {
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
    map[folder] = getAPIs(path.join(basedir, folder), folder);
  });

  return map;
};

/**
 *
 * @param folder
 * @return {Object}object {content: markdown(content), indexs: indexs}
 */
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
  var exists = env.existsSync(docPath);
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
  filter = filter || function (item) {return true;};
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
  obj.filename = path.join(__dirname, '../templates/' + skin + '/index.html');
  obj.docs = getDocs(input);
  obj.apis = getAPIs(path.join(input, 'lib'));
  var section = getTemplates(skin).section;
  var folders = getFolders(path.join(input, 'lib'));
  for (var folder in folders) {
    for (var key in folders[folder]) {
      obj.apis[key] = folders[folder][key];
    }
  }
  for (var key in obj.apis) {
    obj.apis[key] = ejs.render(section, obj.apis[key]);
  }

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
  for (var key in obj.docs) {
    obj.content = markdown(obj.docs[key]);
    obj.indexs = exports.getIndexs(obj.docs[key]);
    fs.writeFileSync(path.join(output, key + '.html'), ejs.render(doc, obj), 'utf8');
  }

  // copy styles
  ncp(path.join(__dirname, '../templates/' + skin + '/bootstrap'), path.join(output, 'bootstrap'), function () {});
  ncp(path.join(__dirname, '../templates/' + skin + '/assets'), path.join(output, 'assets'), function () {});
  console.log('Generated at "'+ output + '".');
  console.log('Please open "' + output + '/index.html" to view it');
};

exports.list = function () {
  var themeFiles = fs.readdirSync(path.join(__dirname, '../templates/'));

  for(var file in themeFiles){
      console.log(themeFiles[file]);
  }
}

exports.install = function (url) {

}