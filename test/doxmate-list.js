/**
 * @author: youxiachai
 * @Date: 13-8-28
 * @version: 1.0
 * To change this template use File | Settings | File Templates.
 */

var exec = require('child_process').exec;
var should = require('should');
describe('doxmate list', function () {
  it('should show default themes', function (done) {
    exec('node ' + __dirname + '/../bin/doxmate list', function (err, stdout) {
      should.not.exist(err);
      stdout.should.include('default');
      stdout.should.include('party');
      stdout.should.include('pomelo');
      stdout.should.include('wordpress');
      done();
    });
  });
});
