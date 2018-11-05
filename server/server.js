var tool = require('./libs/tools.js');
var mongo = require('./mongodb.js'),
	msg =  require('./language/msg.js');

var account = mongo.open('mongodb', 'account'),
	user = mongo.open('mongodb', 'user');

function recall(res, obj){
	var e = {code: 0, errinfo: 'success!'};
	if(obj){
		for(var k in obj) e[k] = obj[k];
	}
	res.writeHead(200, {
		'Content-Type': 'application/json;charset=utf-8;',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With,yourHeaderFeild',
		"Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS"
	});
	res.end( JSON.stringify(e) );
}

function failed(code, res, err){
	var obj = msg.errinfo(code, 'errcn');
	res.end( JSON.stringify(obj) );
	console.log(err);
}
var cookies = {
	set: function (res, val, opt){
//		var second = -(new Date().getTimezoneOffset()) * 60;
		var config = tool.extend({'max-Age': 12*3600, httpOnly: true, domain: '127.0.0.1'}, opt),
			cookie = [], k, cfg = '';
		
		if(!config.httpOnly) delete config.httpOnly;
		for(k in config) cfg += `;${k}=${config[k]}`;
		for(k in val) cookie.push(`${k}=${val[k]}${cfg}`);
//		console.log(cookie);
		res.setHeader('Set-Cookie', cookie);
	},
	get: function (req){
		var cookie = {};
	    req.headers.cookie && req.headers.cookie.split(';').forEach(function( Cookie ) {
	        var parts = Cookie.split('=', 2);
	        cookie[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
	    });
	    return cookie;
	},
	remoe: function (res, keys){
		if(keys instanceof Array){
			var s = [], i , len = keys.length;
			for (i = 0; i < len; i++) s.push(`${keys[i]}='';max-Age=0`);
			res.setHeader('Set-Cookie', s);
		}else if(typeof(keys)=="string")
			res.setHeader('Set-Cookie', `${keys}='';max-Age=0`);
	},
	clear: function(req, res){
		var c = [];
		 req.headers.cookie && req.headers.cookie.split(';').forEach(function( Cookie ) {
	        var parts = Cookie.split('=', 1);
	        c.push(`${parts[0]}='';max-Age=0`);
	    });
	    res.setHeader('Set-Cookie', c);
	}
};
module.exports = function(requrest, response, params){
	var fn = works[params.cmd];
	var cook = cookies.get(requrest);
	if(cook){
		
	}
	if(fn) {
		fn(requrest, response, params);
	} else failed(-3, response);
}

var works = {};
//查询用户
works['10001'] = function(req, res, args){
	var query = {};
	if(args.id) query.id = new RegExp('^'+args.id,'gi');
	user.list(query, args, res, function(res, result){
		recall(res, result);
	}, failed);
};
//增加用户
works['10002'] = function(req, res, args){
	delete args.cmd;
	args.timeStamp = Date.now();
	user.insert(args, res, recall, failed);
};
//更新用户
works['10003'] = function(req, res, args){
//	cookies.set(res, {a:'abc',b:'123'},{'max-Age':60*3, httpOnly: false});
	if(!args.id) return failed('-2', res);
	delete args.cmd;
	user.updateOne(args, res, recall, failed);
};
//删除一条记录
works['10004'] = function(req, res, args){
	user.deleteOne(args, res, recall, failed);
};
//删除多条记录
works['10005'] = function(req, res, args){
	user.remove(args, res, recall, failed);
};