// const alias = require('$_/libs/module-alias');
// alias.addAliases({
// 	'@sscc': 'sscc'
// });

const $_server =  require('$_/http/httpServer.js');
const $_header = require('$_/http/header.js');

var error = require('./libs/error.js');
var fxDB = require('./fx/fxDB.js');
var mxDB = require('./mx/mxDB.js');


$_server.run(init, 8088);

function init(requrest, response){
	var method = requrest.method.toLowerCase();
	requrest.url = decodeURIComponent(requrest.url);
	
	if((/post|put|delete/i).test(method)){
		$_header.write(requrest, response, '.json');
		var post = '';
		requrest.on('data', function(chunk) {
			post += chunk;
		});
		requrest.on('end', function(q) {
			try {
				fbcs(requrest, response, post);
			} catch(e) {
				console.log(e);
				fail(response, e);
			}
		});
		return;
	}
	response.end('END');
}

// 数据库json请求
function fbcs(requrest, response, data){
	let src = requrest.url;
	try{
		// let bf = Buffer.concat(data).toString();
		let post = data ? JSON.parse(data) : {};
		if(src.indexOf('/fx/')>-1) fxDB.works(post, requrest, response);
		else if(src.indexOf('mx/')>-1) mxDB.works(post, requrest, response);
		else error.test(response);
	}catch(e){
		error.end('10', response, e);
	}
}

function fail(res){
	res.end(JSON.stringify({code: -1, error: '请求失败！'}));
}