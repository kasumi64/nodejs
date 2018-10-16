var http  = require('http');
var url   = require('url');
var page  = require('./server/loadPage.js');
var server = require('./server/server.js');
var tool = require('./server/libs/tools.js');


http.createServer(function(requrest, response){
	var src = decodeURIComponent(requrest.url),
		method = requrest.method.toLowerCase();
	if(src =='/favicon.ico' || method == 'options') return response.end();
	
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
	
}).listen(8080);


//var events = require('events');
//var eve = new events.EventEmitter();
//eve.on('type', function(e){
//	console.log(e)
//});
//eve.emit('type', 'EventEmitter');


console.log('Server running at http://127.0.0.1:8080/');
