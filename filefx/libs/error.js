var msg = {
	'0': '操作成功！',
	'100': '爬虫失败！',
	'10': '服务器繁忙，请稍后再试！',
	'11': '功能号不存在!',
	'12': '数据库连接失败！',
	'13': '服务器连接超时，请您重试！',
	'-10': '参数不正确！',
	'-101': '帐号已存在，不可重复增加！',
	'-102': '查询失败！',
	'-103': '更新数据失败！',
	'-104': '帐号不存在！',
	'-105': '删除数据失败！',
	'-106': '增加数据失败！',
	'-107': 'EkeyName已存在，不可重复！！',
	'-108': 'EkeyName不存在！！'
};
var exp = {};

exp.getMsg = function (code){
	return {errcode: code, errinfo: msg[code]};
};

exp.end = function(code, res, err){
	let obj = this.getMsg(code);
	if(err) {
		obj.nodejs = err.toString();
		console.log('异常：', err);
	}
	res.end( JSON.stringify(obj) );
};

exp.send = function(obj={}, res){
	obj.errcode = '0';
	obj.errinfo = msg['0'];
	res.write( JSON.stringify(obj) );
	res.end();
}

exp.test = function(res){
	let debugRes = {errcode:'0', lists:[], errinfo: '这是个测试接口.', defaultPasswd: 'ABCDEFG'};
	let arr = [];
	for (var i = 0; i < 10; i++) {
		arr.push({userID: '01'+i, userName: 'userName'+i,userID1: '006', nodeName: '深圳'+i, cuName: 'CU-1',
		operationTime: 1555553114000, operationType: 3, type: 4, fileName: 'ABC', reviewer: 'reviewer',
		linkGroupName: '', inZone: '', webUserFlag: 1});
	}
	debugRes.lists = arr;
	
	res.end( JSON.stringify(debugRes) );
}

module.exports = exp;
