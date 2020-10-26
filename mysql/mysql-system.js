// const alias = require('$_/libs/module-alias');
// alias.addAliases({
// 	'@sscc': 'sscc'
// });

const $_server =  require('$_/http/httpServer.js');
const $_header = require('$_/http/header.js');




$_server.run(listen, 3406);

function listen(requrest, response){
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
	} else if((/get/i).test(method) && (/^\/get/i).test(requrest.url)){
		$_header.write(requrest, response, '.json');
		get(requrest, response, 'get');
	}
	response.end('ERROR!');
}

// 数据库json请求
function post(requrest, response, data){
	response.end(JSON.stringify({code: 0, error: '请求成功！'}));
}

function get(requrest, response, data){
	response.end(JSON.stringify({code: 0, error: '请求成功！'}));
}

function fail(res){
	res.end(JSON.stringify({code: -1, error: '请求失败！'}));
}