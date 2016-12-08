const log = console.log;
console.log = function() {};
const configuration = require('./webpack.config');
console.log = log;

/* signal the using file into the console */
console.log('\x1b[36musing webpack.config.devbuild.js...\x1b[0m');
configuration[0].plugins.splice(0, 1);
configuration[0].module.rules[0].loaders.splice(1, 1);
Object.keys(configuration[0].entry).forEach(function (key) {
  configuration[0].entry[key].splice(0, 1);
});
module.exports = configuration;
