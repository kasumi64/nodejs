const url = require('url');
const path = require('path');

const header = require('#/http/header.js');
const file = require('#/libs/fs.js');
const router = require('./router.js');


function _404(res){
	res.end('<h1 style="font-size:100px;text-align:center;margin-top:68px">404</h1>');
}

const exp = {};
const resPage = /\.(html|htm|shtml|shtm)/i;

exp.loader = function(req, res){
	// var urlStr = 'http://user:pass@host.com:8080/path/to/file.html?query=string#hash';
	let {src} = req;
	let pathname = url.parse(src).pathname;
	let type = path.extname(pathname);
	if(type===''||resPage.test(pathname)) {
		pathname = pathname.replace(resPage, '');
		src = router.path(pathname);
		type = '.html';
	} else {
		src = 'vue-plugin/page' + src
	}
	header.write(req, res, type);
	
	file.readFile(src).then(assets => {
		res.end(assets);
	}).catch(()=>{ _404(res); });
};




module.exports = exp;