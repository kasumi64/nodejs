const url   = require('url');

const server =  require('#/http/httpServer.js');
const header = require('#/http/header.js');
const page = require('./page/loadAssets.js');

server.run(listen);

function listen(requrest, response){
	let {src, method} = requrest;
	// console.log(src, method);
	
	if(method == 'get'){
		if(/^\/get\//i.test(src)){
			let get = url.parse(src, true).query;
			jsonDispatch(requrest, response, get);
		}
		
		page.loader(requrest, response);
		return
	} else if((/post|put|delete/i).test(method)){
		header.write(requrest, response);
		var post = '';
		requrest.on('data', function(chunk) {
			post += chunk;
		});
		requrest.on('end', function(q) {
			try {
				post = post ? JSON.parse(post) : {};
				jsonDispatch(requrest, response, post);
			} catch(e) {
				console.log(e);
				fail(response, e);
			}
		});
		return;
	}
	
	
	response.end('unknown');
}

function jsonDispatch(req, res, param){
	console.log('post', param);
	res.end(JSON.stringify(param));
	// throw(new Error('test error'))
}

function fail(res){
	res.end(JSON.stringify({code: -1, error: '请求失败！'}));
}