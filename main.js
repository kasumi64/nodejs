var http  = require('http');
var url   = require('url');
var page  = require('./server/loadPage.js');
var server = require('./server/server.js');
var tool = require('./server/libs/tools.js');
var mime = require('./server/libs/mime.js');
var strategy = require('./StrategyPattern.js');


//var socket = require('socket.io');
//console.log(socket)

http.createServer(function(requrest, response){
	var src = decodeURIComponent(requrest.url),
		method = requrest.method.toLowerCase();
	if(src =='/favicon.ico' || method == 'options') {
		response.writeHead(200, {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With,yourHeaderFeild',
		});
		return response.end('options');
	}
	
	if(src.indexOf('/json') == 0 && method != 'get'){
		var post = '';
		requrest.on('data', function(chunk) {
			post += chunk;
		});
		requrest.on('end', function(q) {
			try{
				post = post ? JSON.parse(post) : {};
				server(requrest, response, post);
			}catch(e){
				tool.errcode(-2, response, e);
			}
		});
		return;
	} else if(src.indexOf('/get') == 0 && method == 'get'){
		var get = url.parse(decodeURIComponent(src),true).query;
//			server(requrest, response, get);
		response.end(JSON.stringify(get));
		return;
	}
	
	if(method != 'get') return response.end();
	page.load(requrest, response);
	
}).listen(80);


//var events = require('events');
//var eve = new events.EventEmitter();
//eve.on('type', function(e){
//	console.log(e)
//});
//eve.emit('type', 'EventEmitter');


JSON._stringify_ = JSON.stringify;
JSON.stringify = function (obj, replacer, space){
	let str = '';
	try{
		str = JSON._stringify_(obj, replacer, space);
	}catch(e){
		str = "Object解析失败！"
		console.log(str);
	}
	return str;
}

http.createServer(function(requrest, response){
	let src = decodeURIComponent(requrest.url),
		method = requrest.method.toLowerCase();
	requrest.url = src;
	
	if(src =='/favicon.ico' || method == 'options') {
		mime.writeHead(requrest, response, '.json', {sessionID: 'ABC'});
		return response.end('options');
	}
	// console.log(requrest)
	if(method != 'get'){
		let type = requrest.headers['content-type'];
		// console.log('main', type);
		//上传文件
		if(type.indexOf('multipart/form-data') > -1){
			strategy.file(requrest, response);
			return;
		} 
		
		var received = 0;
		var post = '';
		requrest.on('data', function(chunk) {
			// 停止接收数据，触发end()
			// received += chunk.length;
			// req.destroy();
			post += chunk;
		});
		requrest.on('end', function(q) {
			strategy.accept(post, requrest, response)
		});
		return;
	} else if(method == 'get'){
		var get = url.parse(src, true).query;
		var crawler = require('./filefx/crawler.js');
		crawler.search(get, response);
		// response.end(JSON.stringify(get));
		return;
	}
	
	return response.end();
}).listen(8088);


console.log('Server running at http://127.0.0.1/');
console.log('Server running at http://localhost:8088/');
