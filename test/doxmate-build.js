/**
 * @author: youxiachai
 * @Date: 13-8-28
 * @version: 1.0
 * To change this template use File | Settings | File Templates.
 */
var exec = require('child_process').exec;
var expect = require('expect.js');

describe('doxmate build', function () {
  it('build default', function (done) {
    exec('cd ' +  __dirname + '/example' + ' && node ' + __dirname + '/../bin/doxmate build', function (err, stdout) {
      expect(err).not.to.be.ok();
      expect(stdout).to.be.ok();
      done();
    });
  });

  it('build custom output file', function (done) {
    exec('cd ' + __dirname + '/example' + ' && node ' + __dirname + '/../bin/doxmate build -o default', function (err, stdout) {
      expect(err).not.to.be.ok();
      expect(stdout).to.be.ok();
      done();
    });
  });

  it('build pomelo theme', function (done) {
    exec('cd ' + __dirname + '/example' + ' && node ' + __dirname + '/../bin/doxmate build -o pomelo -s pomelo', function (err, stdout) {
      expect(err).not.to.be.ok();
      expect(stdout).to.be.ok();
      done();
    });
  });

  it('build wordpress theme', function (done) {
    exec('cd ' + __dirname + '/example' + ' && node ' + __dirname + '/../bin/doxmate build -o wordpress -s wordpress', function (err, stdout) {
      expect(err).not.to.be.ok();
      expect(stdout).to.be.ok();
      done();
    });
  });
});
