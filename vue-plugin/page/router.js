const url = require('url');

const base = 'vue-plugin/page';
const router = {
	'/': `${base}/index.html`,
	'/index': `${base}/index.html`,
	'/canvas': `${base}/canvas.html`,
}

module.exports = {
	path(src){
		let s = url.parse(src).pathname;
		return router[s] || '';
	}
}