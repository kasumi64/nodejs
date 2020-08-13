const path = require('path');

const utils = {};
module.exports = utils;

utils.resolve = function (src = ''){
	return path.resolve(src);
};