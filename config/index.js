var fs = require('fs');
var argv = require('optimist').argv;
var path = require('path');

var configs = path.join(__dirname, "config.json") 

if (!fs.existsSync(configs)) {
  throw new Exception("Configuration is missing from: " + configs);
}

try {
  var all_configs = JSON.parse(fs.readFileSync(configs));
} catch (err) {
  console.log("[X] Configuration parsing error in: ", configs);
  console.trace(err);
}

var configuration = all_configs.development;
var configstr = 'development';

if (process.env.NODE_ENV != 'undefined' && process.env.NODE_ENV != null) {
  configstr = process.env.NODE_ENV.toLowerCase();
} else if (process.env.CONFIG_ENV != 'undefined' && process.env.CONFIG_ENV != null) {
  configstr = process.env.CONFIG_ENV.toLowerCase();
}

configuration = all_configs[configstr];
console.log("Using %s configuration.", configstr);


if (!configuration) {
 throw new Error(configstr + " configuration is not defined in config.js");
}

function normalize(config) {
  if (!config.uri || !config.host) {
    throw "you must configure 'uri' and 'host' in config.json.  run ./bin/setup"
  }

}
module.exports = normalize(configuration);


