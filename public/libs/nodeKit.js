const {resolve, join} = require('path');

module.exports = {
	...require('./webkit.js'),
	resolve, join,
	root: resolve(__dirname, '../../')
};
