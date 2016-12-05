const log = console.log;
console.log = function() {};
const configuration = require('./webpack.config');
console.log = log;

/* signal the using file into the console */
console.log('\x1b[36musing webpack.config.slim.js...\x1b[0m');
configuration.splice(1, 1);
module.exports = configuration;
