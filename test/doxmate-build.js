/**
 * @author: youxiachai
 * @Date: 13-8-28
 * @version: 1.0
 * To change this template use File | Settings | File Templates.
 */


var exec = require('child_process').exec;
var should = require('should');
describe('doxmate build', function () {
  it('build default', function (done) {
    exec('cd ' +  __dirname + '/example' + ' && node ' + __dirname + '/../bin/doxmate build', function (err, stdout) {
      should.not.exist(err);
      should.exist(stdout);
      done();
    });
  });

  it('build custom output file', function (done) {
    exec('cd ' + __dirname + '/example' + ' && node ' + __dirname + '/../bin/doxmate build -o default', function (err, stdout) {
      should.not.exist(err);
      should.exist(stdout);
      done();
    });
  });

  it('build pomelo theme', function (done) {
    exec('cd ' + __dirname + '/example' + ' && node ' + __dirname + '/../bin/doxmate build -o pomelo -s pomelo', function (err, stdout) {
      should.not.exist(err);
      should.exist(stdout);
      done();
    });
  });

  it('build wordpress theme', function (done) {
    exec('cd ' + __dirname + '/example' + ' && node ' + __dirname + '/../bin/doxmate build -o wordpress -s wordpress', function (err, stdout) {
      should.not.exist(err);
      should.exist(stdout);
      done();
    });
  });
});
