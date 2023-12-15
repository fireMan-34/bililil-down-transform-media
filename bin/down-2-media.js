const process = require('process');
const { exec } = require('child_process');
const { join, } = require('path');
const args = process.argv.slice(2);

exec(`node ${join(__dirname, '../dist/index.js')} ${args.join(' ')}`);
