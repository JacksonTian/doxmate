var doxmate = require('../');
var should = require('should');
var path = require('path');
var fs = require('fs');

describe("Doxmate", function () {
  it("getIndexs", function () {
    var section = fs.readFileSync(path.join(__dirname, "../README.md"), "utf8");
    var titles = doxmate.getIndexs(section);
    var except = [
      { level: 1, title: 'Doxmate 不再为文档而发愁 [![Build Status](https://secure.travis-ci.org/JacksonTian/doxmate.png)](http://travis-ci.org/JacksonTian/doxmate)'},
      { level: 2, title: '来源' },
      { level: 2, title: 'Installation' },
      { level: 2, title: 'Usage' },
      { level: 2, title: '查看文档效果' },
      { level: 2, title: 'Github与CommonJS规范' },
      { level: 2, title: 'License (MIT)' }
    ];
    titles.should.eql(except);
  });
});
