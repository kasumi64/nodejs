var msg = {
	'0': '操作成功！',
	'1': '操作部分成功！',
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
	'-108': 'EkeyName不存在！！',
	'-109': '文件不是JSON格式！！',
	'-110': '联系人已存在，不可重复增加！'
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
	let debugRes = {errcode:'0', lists:[], errinfo: '这是个测试接口.', defaultPasswd: 'ABCDEFG', totalSize: 10};
	let arr = [];
	for (var i = 0; i < 10; i++) {
		let obj = {userID: '01'+i, userName: 'userName'+i,userID1: '006', nodeName: '深圳'+i, cuName: 'CU-1',
		operationTime: 1555553114000, operationType: i%2, type: 4, fileName: 'ABC', reviewer: 'reviewer',
		linkGroupName: '', inZone: '', webUserFlag: 1, errInfo: '用户操作结果：\nsuccess',
		exeState: i%4+1, feedbackState: i%3+1 ,legal: i%3, legalInfo: '合法详情', userType: '4'};
		obj.bizKey = '01'+i;
		if(i%2){
			obj.isModifyFlag = 1;
			obj.remark = 'remark'+i;
		}
		arr.push(obj);
	}
	debugRes.lists = arr;
	
	res.end( JSON.stringify(debugRes) );
}

module.exports = exp;
