/**
 * @author: youxiachai
 * @Date: 13-8-28
 * @version: 1.0
 * To change this template use File | Settings | File Templates.
 */
var exec = require('child_process').exec;
var expect = require('expect.js');

describe('doxmate theme', function () {
  it('should show default themes', function (done) {
    exec('node ' + __dirname + '/../bin/doxmate theme list', function (err, stdout) {
      expect(err).not.to.be.ok();
      expect(stdout).to.contain('default');
      expect(stdout).to.contain('pomelo');
      expect(stdout).to.contain('wordpress');
      done();
    });
  });

  it('should export theme ok', function (done) {
    exec('cd ' + __dirname + '/example' + ' && node ' + __dirname + '/../bin/doxmate theme export', function (err, stdout) {
      expect(err).not.to.be.ok();
      expect(stdout).to.contain('Exported at ');
      expect(stdout).to.contain('You can edit ');
      expect(stdout).to.contain('default');
      expect(stdout).to.contain(' for custom theme style.');
      done();
    });
  });

  it('should export theme pomelo ok', function (done) {
    exec('cd ' + __dirname + '/example' + ' && node ' + __dirname + '/../bin/doxmate theme export -s pomelo', function (err, stdout) {
      expect(err).not.to.be.ok();
      expect(stdout).to.contain('Exported at ');
      expect(stdout).to.contain('You can edit ');
      expect(stdout).to.contain('pomelo');
      expect(stdout).to.contain(' for custom theme style.');
      done();
    });
  });

  it('should export themes wordpress ok', function (done) {
    exec('cd ' + __dirname + '/example' + ' && node ' + __dirname + '/../bin/doxmate theme export -s wordpress', function (err, stdout) {
      expect(err).not.to.be.ok();
      expect(stdout).to.contain('Exported at ');
      expect(stdout).to.contain('You can edit ');
      expect(stdout).to.contain('wordpress');
      expect(stdout).to.contain(' for custom theme style.');
      done();
    });
  });
});
