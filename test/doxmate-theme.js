/**
 * @author: youxiachai
 * @Date: 13-8-28
 * @version: 1.0
 * To change this template use File | Settings | File Templates.
 */


var exec = require('child_process').exec;
var should = require('should');
describe('doxmate theme', function () {
  it('should show default themes', function (done) {
    exec('node ' + __dirname + '/../bin/doxmate theme list', function (err, stdout) {
      should.not.exist(err);
      stdout.should.include('default');
      stdout.should.include('pomelo');
      stdout.should.include('wordpress');
      done();
    });
  });

  it('should export theme ok', function (done) {
    exec('cd ' + __dirname + '/example' + ' && node ' + __dirname + '/../bin/doxmate theme export', function (err, stdout) {
      should.not.exist(err);
      stdout.should.include('Exported at ');
      stdout.should.include('You can edit ');
      stdout.should.include('default');
      stdout.should.include(' for custom theme style.');
      done();
    });
  });

  it('should export theme pomelo ok', function (done) {
    exec('cd ' + __dirname + '/example' + ' && node ' + __dirname + '/../bin/doxmate theme export -s pomelo', function (err, stdout) {
      should.not.exist(err);
      stdout.should.include('Exported at ');
      stdout.should.include('You can edit ');
      stdout.should.include('pomelo');
      stdout.should.include(' for custom theme style.');
      done();
    });
  });

  it('should export themes wordpress ok', function (done) {
    exec('cd ' + __dirname + '/example' + ' && node ' + __dirname + '/../bin/doxmate theme export -s wordpress', function (err, stdout) {
      should.not.exist(err);
      stdout.should.include('Exported at ');
      stdout.should.include('You can edit ');
      stdout.should.include('wordpress');
      stdout.should.include(' for custom theme style.');
      done();
    });
  });
});
