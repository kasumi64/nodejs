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
	res.end( JSON.stringify(e) );
}

function failed(code, res, err){
	var obj = msg.errinfo(code, 'errcn');
	res.end( JSON.stringify(obj) );
	console.log(err);
}
module.exports = function(requrest, response, params){
	var fn = works[params.cmd];
	response.writeHead(200, {
		'Content-Type': 'application/json;charset=utf-8;',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With,yourHeaderFeild',
		"Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS"
	});
	if(fn) {
		fn(params, response);
	} else failed(-3, response);
}
var works = {};
//查询用户
works['10001'] = function(args, res){
	var query = {};
	if(args.id) query.id = new RegExp('^'+args.id,'gi');
	user.list(query, args, res, function(res, result){
		recall(res, result);
	}, failed);
};
//增加用户
works['10002'] = function(args, res){
	delete args.cmd;
	args.timeStamp = Date.now();
	user.insert(args, res, recall, failed);
};
//更新用户
works['10003'] = function(args, res){
	user.updata(args, res, recall, failed);
};
//删除一条记录
works['10004'] = function(args, res){
	user.deleteOne(args, res, recall, failed);
};
//删除多条记录
works['10005'] = function(args, res){
	user.remove(args, res, recall, failed);
};