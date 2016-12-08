const log = console.log;
console.log = function() {};
const configuration = require('./webpack.config');
console.log = log;

/* signal the using file into the console */
console.log('\x1b[36musing webpack.config.slim.js...\x1b[0m');
configuration[1].name = 'acme.js';
configuration[1].plugins.splice(0, 1);
delete configuration[1].entry['bundle'];
configuration[1].module.rules[0].loader = 'null-loader';
module.exports = configuration;
