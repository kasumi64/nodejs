const url = require('url');
// const $_kit = require('$_kit');

const base = 'vue-plugin/page';
const router = {
	'/': `${base}/index.html`,
	'/index': `${base}/index.html`,
	'/canvas': `${base}/canvas.html`,
};
const reg = /^\/\$_\//; //以/$_/开头的重定向到./public/下

module.exports = {
	page(src){
		let name = url.parse(src).pathname;
		return router[name] || '';
	},
	path(src){
		if(reg.test(src)) {
			return src.replace(reg, './public/');
		}
		// console.log($_kit.verifyCode(4));
		return base + src;
	}
}