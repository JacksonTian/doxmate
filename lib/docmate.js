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
  templates = {
    'section': section,
    'homepage': homepage,
    'api': api
  };
  return templates;
};

var types = {
  "param": "参数",
  "example": "示例",
  "return": "返回"
};

var getAPIs = function (folder) {
  var files = fs.readdirSync(path.join(folder, 'lib')).filter(function (item) {
    return path.extname(item) === '.js';
  });

  var apis = {};
  files.forEach(function (file) {
    var basename = path.basename(file, '.js');
    var buf = fs.readFileSync(path.join(folder, 'lib', file), 'utf8');
    var obj = dox.parseComments(buf, {});
    var section = getTemplates().section;
    apis[basename] = ejs.render(section, {types: types, comments: obj});
  });

  return apis;
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
 * docmate的版本号
 */
exports.version = require('../package.json').version;

/**
 * 处理目录
 * @param {String} folder 目录路径
 */
exports.process = function (folder) {
  var obj = require(path.join(folder, 'package.json'));
  obj.filename = path.join(__dirname, '../templates/index.html');
  obj.docs = getDocs(folder);
  obj.apis = getAPIs(folder);
  obj.readme = getReadme(folder);

  // generate api
  var api = getTemplates().api;
  fs.writeFileSync(path.join(folder, 'doc/api.html'), ejs.render(api, obj), 'utf8');
  
  // generate homepage
  var homepage = getTemplates().homepage;
  fs.writeFileSync(path.join(folder, 'doc/index.html'), ejs.render(homepage, obj), 'utf8');

  // generate docs
  for (var key in obj.docs) {
    var content = obj.docs[key];
    fs.writeFileSync(path.join(folder, 'doc/' + key + '.html'), ejs.render(content, obj), 'utf8');
  }

  // copy styles
  ncp(path.join(__dirname, '../templates/bootstrap'), path.join(folder, 'doc/bootstrap'), function () {});
  ncp(path.join(__dirname, '../templates/base.css'), path.join(folder, 'doc/base.css'), function () {});
};
