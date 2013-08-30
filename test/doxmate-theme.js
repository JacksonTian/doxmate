/**
 * @author: youxiachai
 * @Date: 13-8-28
 * @version: 1.0
 * To change this template use File | Settings | File Templates.
 */


var exec = require('child_process').exec;
var should = require('should');
describe('doxmate build', function () {
  it('should show default themes', function (done) {
    exec('node ' + __dirname + '/../bin/doxmate theme list', function (err, stdout) {
      should.not.exist(err);
      stdout.should.include('default');
      stdout.should.include('pomelo');
      stdout.should.include('wordpress');
      done();
    });
  });

  it('should create themes options', function (done) {
    exec('cd ' + __dirname + '/example' + ' && node ' + __dirname + '/../bin/doxmate theme options', function (err, stdout) {
      should.not.exist(err);
      should.exist(stdout);
      done();
    });
  });

  it('should create themes pomelo options', function (done) {
    exec('cd ' + __dirname + '/example' + ' && node ' + __dirname + '/../bin/doxmate theme options -s pomelo', function (err, stdout) {
      should.not.exist(err);
      should.exist(stdout);
      done();
    });
  });

  it('should create themes wordpress options', function (done) {
    exec('cd ' + __dirname + '/example' + ' && node ' + __dirname + '/../bin/doxmate theme options -s wordpress', function (err, stdout) {
      should.not.exist(err);
      should.exist(stdout);
      done();
    });
  });
});
