var exp = {}, fs = require('fs');
var path = require('path');
var router = require('../dynamic/router.js');
var mime = require('./libs/mime.js');
//var url = require('url');

function isEmpty(obj){
	for(let k in obj) return false;
	return true;
}

function render(spring, dom, res){
	var html = {dom}, obj;
	for(let k in spring){
		obj = {k, src:spring[k], spring};
		read(obj, html, res);
	}
}
function read(obj, html, res){
	var k = obj.k, src = obj.src, spring = obj.spring;
	fs.readFile('.' + src, function(err, buffer){
		if(err){
			console.log('\nhtml读取失败--', src);
			buffer = '';
		}
		buffer += '';
		buffer = buffer.replace(/<\/{0,1}(!DOCTYPE|html|head|meta|body|title).{0,}\>/gim, '');
//		console.log(buffer);
		
		let reg = new RegExp(k, 'g');
		html.dom = html.dom.replace(reg, buffer);
		delete spring[k];
		if( isEmpty(spring) ){
			spring = include(html.dom);
			if(!spring){
				res.write(html.dom, 'utf-8');
				res.end(); /*结束响应*/
			} else render(spring, html.dom, res);
		}
	});
}

function include(html){
	var spring = {};
	html.replace(/<#%(.+?)%#>/g, function(tag, p){
//		console.log(tag, p);
		spring[tag] = p;
	});
	if( isEmpty(spring) ) return false;
	return spring;
}
exp.load = function(requrest, response){
	var src = router.path(decodeURIComponent(requrest.url));
	fs.readFile('.' + src, function(e, buffer){
		let type = path.extname(src);
//		console.log(type, src); //await
		if(e){
			console.log('404么有这个文件 --', src);
			return response.end('404');
		}
		
		response.writeHead(200, {
			'Content-Type': mime.type(type) + ';charset=utf-8;',
			'Access-Control-Allow-Origin': '*',
			"Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
			'Access-Control-Allow-Credentials': true,
			'Access-Control-Allow-Headers': 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type',
			'connection': 'keep-alive',
//			'Set-Cookie': 'session=abcdefg'
		});
		
		if(type == '.html'){
			buffer += '';
			buffer = buffer.replace(/<!--[\s\S]+?-->/g, '');
			let spring = include(buffer);
			if(spring) return render(spring, buffer, response);
		}
		
		response.write(buffer, 'utf-8');
		response.end(); /*结束响应*/
	});
	return this;
};

module.exports = exp;