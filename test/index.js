var doxmate = require('../');
var should = require('should');
var path = require('path');
var fs = require('fs');

describe("Doxmate", function () {
  it("getIndexs", function () {
    var section = fs.readFileSync(path.join(__dirname, "../README.md"), "utf8");
    var titles = doxmate.getIndexs(section);
    var except = [
      { level: 1, title: 'Doxmate 不再为文档而发愁 [![Build Status](https://secure.travis-ci.org/JacksonTian/doxmate.png?branch=master)](http://travis-ci.org/JacksonTian/doxmate)'},
      { level: 2, title: '来源' },
      { level: 2, title: 'Installation' },
      { level: 2, title: 'Usage' },
      { level: 3, title: '选择模版' },
      { level: 3, title: '自定义模版' },
      { level: 2, title: '查看文档效果' },
      { level: 3, title: "默认风格" },
      { level: 3, title: "wordpress风格" },
      { level: 3, title: "pomelo风格" },
      { level: 2, title: 'Github与CommonJS规范' },
      { level: 2, title: '贡献者' },
      { level: 2, title: 'License (MIT)' },
      { level: 2, title: "捐赠" }
    ];
    titles.should.eql(except);
  });
});
