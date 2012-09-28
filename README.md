Docmate 不再为文档而发愁
======================
# 来源
过去通常要自己维护API文档，这会是一件比较蛋疼的事情。所幸我们有dox。但是dox不能帮我们任意生成文档。于是就有了docmate。在遵循Github和CommonJS的约定后，docmate可以帮你的模块包生成文档。
# Installation
安装
```
npm install docmate -g
```
# Usage
此处将以docmate项目自身作为例子：
```
// 签出docmate项目
git clone git://github.com/JacksonTian/docmate.git ~/git/docmate
// 指定项目路径
docmate -i ~/git/docmate
// 在doc目录下将会得到文档
open ~/git/docmate/doc/index.html
// 或者 -o folder，可以将文档生成到指定的目录下
docmate -i ~/git/docmate -o ~/output
```
# 查看效果
通过将生成的文档放到gh-pages分之中，可以通过链接<http://jacksontian.github.com/docmate>直接查看效果。

# License (MIT)
Copyright (c) 2012 Jackson Tian
http://weibo.com/shyvo

The MIT License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
