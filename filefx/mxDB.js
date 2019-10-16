var mongo = require('./libs/ctrlDB.js'),
	dict = require('./libs/dictionary.js'),
	error = require('./libs/error.js'),
	fxDB = require('./fxDB.js');
	
var account = mongo.open('fxDB', 'user'),
	ekey = mongo.open('fxDB', 'ekey'),
	signal = mongo.open('fxDB', 'signal'),
	audit = mongo.open('fxDB', 'audit'),
	information = mongo.open('fxDB', 'information');

var fs = require('fs');

var accept = {};

function getType(obj){
	let tostr = Object.prototype.toString;
	let tp = tostr.call(obj).toLocaleLowerCase();
	return tp.replace(/\[object |]/g, '');
}

function rand(num){
	let seed = Date.now();
	seed = ( seed * 9301 + 49297 ) % 233280;
	seed = seed / ( 233280.0 );
	return Math.ceil(seed * num);
}

function getRandID(len = 6){
	let i, num = '';
	for (i = 0; i < len; i++) {
		num += Math.floor(Math.random()*10)
	}
	return num;
}

function random(min, max){
	var num = (max > min) ? Math.floor(Math.random() * (max - min + 1)) + min :
		Math.floor(Math.random() * (min - max + 1)) + max;
	return num;
}

/********************** 用户 **************************/






/************************* 字典或通用 *******************************/
accept['600000'] = fxDB.accept['600000'];





exports.works = async function(params = {}, req, res){
	let fn = accept[params.cmdID];
	if(fn) {
		let out = setTimeout(() => { error.end('13', res, '超时'+params.cmdID); }, 2000);
		let bool = await fn(params, res, req);
		if(bool === true) clearTimeout(out);
		else console.log('Async Await');
	} else error.test(res);
};

exports.accept = accept;
