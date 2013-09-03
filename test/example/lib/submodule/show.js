/**
 * @author: youxiachai
 * @Date: 13-8-30
 * @version: 1.0
 * To change this template use File | Settings | File Templates.
 */
"use strict";

var fs = require('fs');
var path = require('path');

/**
 *
 * @param p
 * @returns {*}
 */
exports.existsSync = function (p) {
  if (fs.existsSync) {
    return fs.existsSync(p);
  }
  if (path.existsSync) {
    return path.existsSync(p);
  }
};