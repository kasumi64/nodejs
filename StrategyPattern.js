// var http  = require('http');
// var url   = require('url');
// var page  = require('./server/loadPage.js');
// var server = require('./server/server.js');
// var tool = require('./server/libs/tools.js');
var mime = require('./server/libs/mime.js');
var error = require('./filefx/libs/error.js');
var fxDB = require('./filefx/fxDB.js');
var mxDB = require('./filefx/mxDB.js');
var fileManager = require('./reptile/FileManager.js');

const exp = {};
module.exports = exp;

//落地文件
exp.file = function (requrest, response){
	mime.writeHead(requrest, response);
	// res.writeHead(200,{  
	// 	  'Content-Type': 'application/octet-stream', //告诉浏览器这是一个二进制文件  
	// 	  'Content-Disposition': 'attachment; filename=' + fileName, //告诉浏览器这是一个需要下载的文件  
	// });
	fileManager.classify(requrest, response);
}
exp.accept = function (data, requrest, response)
{
	// console.log('StrategyPattern', requrest.headers);
	// console.log(data);
	let src = requrest.url;
	if(src.indexOf('/json')>-1) {
		mime.writeHead(requrest, response, '.json');
		response.end('{"errcode":0,"errinfo": "POST Json OK!"}');
	} else fbcs(data, requrest, response);
};
exp.get = function (data, requrest, response)
{
	mime.writeHead(requrest, response, '.json');
	// console.log('StrategyPattern', requrest.headers);
	response.end('{"errcode":0,"errinfo": "Get Json OK!"}');
};

// 数据库json请求
function fbcs(data, requrest, response){
	let src = requrest.url;
	mime.writeHead(requrest, response, '.json', {sessionID: 'ABC'});
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
