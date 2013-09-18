var os = require('os');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var rmdir = require('rimraf');
var async = require('async');
var fs = require('fs-extra');
var _ = require('underscore');
var debug = require('debug')('honeyfiles');
var glob = require('glob');
var path = require('path');
var util = require('util');
var mkdirp = require('mkdirp');
var unzip = require('unzip');
var EventEmitter = require('events').EventEmitter;

function Docx(options) {
  var self = this;
  self.template = options.template || path.join(__dirname, '../../../../config/template.docx');

  if (!fs.existsSync(self.template)) {
    throw "template does not exist: " + self.template;
  }

  self.id = options.id.toString();
  self.tmpdir = path.join(os.tmpDir(), 'honeyfiles', self.id); 
  self.output = self.tmpdir + '.docx';
  self.variables = options.variables;

  self.once('setup', self._replace.bind(this));
  self.once('replaced', self._zip.bind(this));
  self.once('zipped', self._done.bind(this));

};

util.inherits(Docx, EventEmitter);

Docx.prototype._done = function() {
  var self = this;
  rmdir(this.tmpdir, function(err) {
    fs.readFile(self.output, function(err, data) {
      if (err) return self.emit('error', err);
      fs.unlinkSync(self.output);
      self.emit('done', data); 
    })
  });
}

Docx.prototype._setup = function() {
  var self = this;
    
  debug("writing to", self.tmpdir)

  if (!fs.existsSync(self.tmpdir)) {
    mkdirp.sync(self.tmpdir);
  }


  mkdirp.sync(self.tmpdir);

  if (!fs.existsSync(self.template)) {
    return self.emit('error', 'template does not exist:' + self.template);
  };

  var output = unzip.Extract({ path: self.tmpdir });
  debug("Unzipping to: ", self.tmpdir);

  fs.createReadStream(self.template).pipe(output);

  output.on('error', function(err) { self.emit('error', err )});
  output.on('close', function() {
    self.emit('setup');
  });
};

Docx.prototype._replace = function() {
  var self = this;

  glob("**/*.xml*", { cwd: self.tmpdir },  function(err, files) {
    async.each(files, function(file, cb) {

      file = path.join(self.tmpdir, file);
      debug("processing", file);

      fs.readFile(file, function(err, data) {
        data = data.toString();
        if (err) return cb(err);

        _.each(self.variables, function(value, key) {
          var regex = new RegExp(key, 'g');
          if (data.match(regex)) {
            debug("replacing", key, value, "on", file, data);
            data = data.replace(regex, value);   
          }
        });

        fs.writeFile(file, data, function(err) {
          return cb(err);
        });

      });
    }, function(err) {
      if (err) return self.emit('error', err);
      self.emit('replaced');
    })
  }); 
};

Docx.prototype._zip = function() {
  var self = this;
    
  if (!fs.existsSync(self.tmpdir)) {
    mkdirp.sync(self.tmpdir);
  };

  if (!fs.existsSync(self.template)) {
    return self.emit('error', 'template does not exist:' + self.template);
  };

  var output = self.output; 
  var options = { cwd: self.tmpdir };
  var cmd = "zip -r \"" + output + "\" *";
  debug('running:', cmd, options);
  exec(cmd, options, function(err, stdout, stderr) {
    
    debug('stdout:', stdout, 'stderr:', stderr)
    if (err) return self.emit('error', err);
    if (!fs.existsSync(output)) 
      return self.emit('error', 'Unable to create file:' + stdout + ":" + stderr);
     self.emit('zipped');
  })

};

Docx.prototype.run = function() {
  var self = this;
  self._setup();
};

module.exports = Docx;

// module.exports = Docx;
// var v = new Docx({
  // id: 1,
  // variables: {
    // "{{TEMPLATEURL}}": "http://cl.ly/image/1L1V0x0S1S0o/Screen%20Shot%202013-09-09%20at%204.51.44%20PM.png"
  // }
// })

// v.run();
