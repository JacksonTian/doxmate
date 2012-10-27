Doxmate 不再为文档而发愁 [![Build Status](https://secure.travis-ci.org/JacksonTian/doxmate.png?branch=master)](http://travis-ci.org/JacksonTian/doxmate)
======================
## 来源
过去通常要自己维护API文档，这会是一件比较蛋疼的事情。所幸我们有[dox](https://github.com/visionmedia/dox)，dox可以帮我们解析注解。但是dox不能帮我们任意生成文档。于是就有了doxmate，doxmate基于dox的注解对象，加入模板。在遵循Github和CommonJS的约定后，doxmate可以帮你的模块包快速生成文档。
## Installation
安装
```
npm install doxmate -g
```
## Usage
此处将以doxmate项目自身作为例子：
```
// 签出doxmate项目
git clone git://github.com/JacksonTian/doxmate.git ~/git/doxmate
// 指定项目路径
doxmate -i ~/git/doxmate
// 在doc目录下将会得到文档
open ~/git/doxmate/doc/index.html
// 或者 -o folder，可以将文档生成到指定的目录下
doxmate -i ~/git/doxmate -o ~/output
```
## 查看文档效果
通过将生成的文档放到gh-pages分支中，可以通过链接<http://jacksontian.github.com/doxmate>直接查看效果。

## Github与CommonJS规范
- 每个github项目下应该有一个README.md文件
- CommonJS规范建议文档存在在`doc`目录下
- CommonJS规范建议代码存在在`lib`目录下

Doxmate将会扫描项目下的README.md和doc目录下的md文件，通过markdown渲染，生成页面。扫描lib目录下的文件，通过dox解析内容，生成API文档页面。

## License (MIT)
```
Copyright (c) 2012 Jackson Tian
http://weibo.com/shyvo

The MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this 
software and associated documentation files (the "Software"), to deal in the Software 
without restriction, including without limitation the rights to use, copy, modify, 
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to 
permit persons to whom the Software is furnished to do so, subject to the 
following conditions:

The above copyright notice and this permission notice shall be included in all copies 
or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```