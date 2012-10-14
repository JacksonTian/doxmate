var fs = require('fs');
var path = require('path');

var ejs = require('ejs');
var markdown = require('github-flavored-markdown').parse;
var dox = require('dox');
var ncp = require('ncp').ncp;

var templates;
var getTemplates = function () {
  if (templates) {
    return templates;
  }
  var section = fs.readFileSync(path.join(__dirname, '../templates/section.html'), 'utf8');
  var homepage = fs.readFileSync(path.join(__dirname, '../templates/index.html'), 'utf8');
  var api = fs.readFileSync(path.join(__dirname, '../templates/api.html'), 'utf8');
  var doc = fs.readFileSync(path.join(__dirname, '../templates/doc.html'), 'utf8');

  templates = {
    'section': section,
    'homepage': homepage,
    'api': api,
    'doc': doc
  };
  return templates;
};

var types = {
  "param": "参数",
  "example": "示例",
  "return": "返回"
};

var getAPIs = function (basedir, folder) {
  var apis = {};
  // 读取目录
  fs.readdirSync(basedir)
  // 获取JS文件列表
  .filter(function (item) {
    return path.extname(item) === '.js';
  })
  // 迭代JS文件，获取注解，生成文档片段
  .forEach(function (file) {
    var basename = path.basename(file, '.js');
    basename = folder ? folder + '/' + basename : basename;
    var buf = fs.readFileSync(path.join(basedir, file), 'utf8');
    var obj = dox.parseComments(buf, {});
    var section = getTemplates().section;
    apis[basename] = ejs.render(section, {types: types, comments: obj, basename: basename});
  });

  return apis;
};

var getFolders = function (basedir) {
  var map = {};
  // 读取目录
  fs.readdirSync(basedir)
  // 过滤出目录列表
  .filter(function (item) {
    var stat = fs.statSync(path.join(basedir, item));
    return stat.isDirectory();
  })
  // 迭代目录
  .forEach(function (folder) {
    map[folder] = getAPIs(path.join(basedir, folder), folder);
  });

  return map;
};

var getReadme = function (folder) {
  var content = fs.readFileSync(path.join(folder, 'README.md'), 'utf8');
  return markdown(content);
};

var getDocs = function (folder) {
  var docs = {};
  var docPath = path.join(folder, 'doc');
  var exists = fs.existsSync(docPath);
  if (!exists) {
    fs.mkdirSync(docPath, '0777');
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
 * doxmate的版本号
 */
exports.version = require('../package.json').version;

/**
 * 处理目录，生成文档
 * @param {String} input 输入目录路径
 * @param {String} output 输出目录路径
 */
exports.process = function (input, output) {
  var obj = require(path.resolve(input, 'package.json'));
  obj.filename = path.join(__dirname, '../templates/index.html');
  obj.docs = getDocs(input);
  obj.apis = getAPIs(path.join(input, 'lib'));
  var folders = getFolders(path.join(input, 'lib'));
  for (var folder in folders) {
    for (var key in folders[folder]) {
      obj.apis[key] = folders[folder][key];
    }
  }

  obj.readme = getReadme(input);

  // generate api
  var api = getTemplates().api;
  fs.writeFileSync(path.join(output, 'api.html'), ejs.render(api, obj), 'utf8');

  // generate homepage
  var homepage = getTemplates().homepage;
  fs.writeFileSync(path.join(output, 'index.html'), ejs.render(homepage, obj), 'utf8');

  // generate docs
  var doc = getTemplates().doc;
  for (var key in obj.docs) {
    obj.content = markdown(obj.docs[key]);
    fs.writeFileSync(path.join(output, key + '.html'), ejs.render(doc, obj), 'utf8');
  }

  // copy styles
  ncp(path.join(__dirname, '../templates/bootstrap'), path.join(output, 'bootstrap'), function () {});
  ncp(path.join(__dirname, '../templates/assets'), path.join(output, 'assets'), function () {});
};
