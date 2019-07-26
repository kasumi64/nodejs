var mongo = require('./libs/ctrlDB.js'),
	dict = require('./libs/dictionary.js'),
	error =  require('./libs/error.js');
	
var account = mongo.open('fxDB', 'user'),
	ekey = mongo.open('fxDB', 'ekey'),
	signal = mongo.open('fxDB', 'signal'),
	audit = mongo.open('fxDB', 'audit');

var accept = {};

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

/********************** 用户 **************************/
accept['600001'] = function userList(params, res, isAdvanced){
	if(typeof params != 'object') return error.end('-10', res, '600001');
	
	let query = {}, fields = {};
	if(params.userID) query.userID = new RegExp(params.userID, 'gi');
	if(params.userName) query.userName = new RegExp(params.userName, 'gi');
	
	if(isAdvanced){
		query = isAdvanced;
	} else fields = {userID: 1, userName:1};
	
	account.getList(query, params, fields).then(result => {
		let msg = Object.assign(error.getMsg('0'), result);
		res.write( JSON.stringify(msg) );
		res.end();
	});
	return true;
};
accept['600051'] = function (params = {}, res){
	let query = {};
	if(params.userID) query.userID = new RegExp(params.userID, 'gi');
	if(params.userName) query.userName = new RegExp(params.userName, 'gi');
	if(params.userType != '') query.userType = params.userType;
	if(params.inZone != 'all') query.inZone = params.inZone;
	if(params.linkGroupName != 'all') query.linkGroupName = params.linkGroupName;
	
	accept['600001'](params, res, query);
	return true;
};

async function getUser(params={}, res, fields){
	let userID = params.userID;
	if(!userID) return error.end('-10', res);
	let options = {projection: fields}
	let user = await account.findOne({userID}, options).then(result => {
		if(result == null) error.end('-104', res);
		return result;
	}).catch(e => {
		error.end('-102', res, e);
		return null;
	});
	return user;
}

accept['600002'] = async function getList (params={}, res){
	let user = await getUser(params, res);
	if(user) error.send({lists: [user]}, res);
	return true;
};
accept['600003'] = async function addUser(params={}, res, now){
	if(await checkID(params, res)) {
		error.end('-101', res);
		return (now === true) ? false : true;;
	}
	
	params.createTimestamp = Date.now();
	params.userConfigDate =  params.createTimestamp / 1000;
	params.userpasswdExpiredFlag = '1';
	return account.insertOne(params).then(result => {
		if(now !== true) error.end('0', res);
		return true;
	}).catch(e => {
		error.end('-106', res, e);
		return (now === true) ? false : true;
	});
};
accept['600006'] = async function addUserNow(params={}, res){
	let add = await accept['600003'](params, res, true);
	if(add)  error.send({uuid: 'uuid'+getRandID()}, res);
	return true;
};

async function checkID(params={}, res){
	let userID = params.userID;
	if(!userID) return error.end('-10', res);
	return !!await account.findOne({userID}, {projection:{userID:1}});
}

accept['600004'] = async function updateUser(params, res, now){
	if(!await checkID(params, res)) {
		error.end('-104', res);
		return (now === true) ? false : true;
	}
	
	let id = {userID: params.userID};
	return account.updateOne(id, params).then(function() {
		if(now !== true) error.end('0', res);
		return true;
	}).catch(e => {
		error.end('-103', res, e);
		return (now === true) ? false : true;
	});
};
accept['600007'] = async function updateUserNow(params={}, res){
	let add = await accept['600004'](params, res, true);
	if(add)  error.send({uuid: 'uuid'+getRandID()}, res);
	return true;
};
accept['600005'] = function deleteUser(params, res, req){
	account.deleteOne({userID: params.userID}).then(result => {
		error.end('0', res);
	}).catch(e => { error.end('-105', res, e); });
	return true;
};
accept['600009'] = async function modifyPwd(params, res, now){
	if(!await checkID(params, res)) {
		error.end('-104', res);
		return (now === true) ? false : true;
	}
	let id = {userID: params.userID};
	params.userpasswdExpiredFlag = params.expiredTimeFlag;
	delete params.expiredTimeFlag;
	return account.updateOne(id, params).then(function() {
		if(now !== true) error.end('0', res);
		return true;
	}).catch(e => {
		error.end('-103', res, e);
		return (now === true) ? false : true;
	});
};
accept['600010'] = async function modifyPwdNow(params={}, res){
	let add = await accept['600009'](params, res, true);
	if(add)  error.send({uuid: 'uuid'+getRandID()}, res);
	return true;
};
accept['600011'] = async function expiredTime(params, res){
	let user = await getUser(params, res, {userpasswdExpiredFlag: 1}) || {};
	let userpasswdExpiredFlag = user.userpasswdExpiredFlag || '1';
	error.send({userpasswdExpiredFlag}, res);
	return true;
};
accept['600012'] = function defaultPasswd(params, res){
	error.send({defaultPasswd: '123456'}, res);
	return true;
};

/******************************** Ekey *************************************/

accept['600031'] = function EkeyList(params, res){
	if(typeof params != 'object') return error.end('-10', res, '600031');
	let query = {};
	if(params.userID) query.userID = new RegExp(params.userID, 'gi');
	if(params.ekeyName) query.ekeyName = new RegExp(params.userName, 'gi');
	ekey.getList(query, params).then(result => {
		let msg = Object.assign(error.getMsg('0'), result);
		res.write(JSON.stringify(msg));
		res.end();
	});
	return true;
};
accept['600052'] = accept['600031'];
accept['600032'] = async function addEkey(params, res, now){
	let user = await getUser(params, res, {userID: 1, userName: 1});
	let eName = await checkEkey(params, res);
	if(!user) return (now === true) ? false : true;;
	if(eName) {
		error.end('-107', res);
		return (now === true) ? false : true;;
	} 
	
	params.userName = user.userName;
	return ekey.insertOne(params).then(e => {
		if(now !== true) error.end('0', res);
		return true;
	}).catch(e => {
		error.end('-106', res, e);
		return (now === true) ? false : true;
	});
};
accept['600035'] = async function addEkeyNow(params, res){
	let add = await accept['600032'](params, res, true);
	if(add)  error.send({uuid: 'uuid'+getRandID()}, res);
	return true;
};

async function checkEkey(params = {}, res){
	let ekeyName = params.ekeyName;
	if(!ekeyName) return error.end('-10', res);
	return !!await ekey.findOne({ekeyName}, {projection: {ekeyName: 1} });
}

accept['600033'] = async function modifyEkey(params, res, now){
	let user = await getUser(params, res, {userID: 1, userName: 1});
	if(!user) return (now === true) ? false : true;;
	
	let id = {userID: params.userID};
	params.userName = user.userName;
	return ekey.updateOne(id, params).then(e => {
		if(now !== true) error.end('0', res);
		return true;
	}).catch(e => {
		error.end('-106', res, e);
		return (now === true) ? false : true;
	});
};
accept['600036'] = async function modifykeyNow(params, res){
	let add = await accept['600033'](params, res, true);
	if(add)  error.send({uuid: 'uuid'+getRandID()}, res);
	return true;
};
accept['600034'] = async function delEkey(params, res, now){
	let eName = await checkEkey(params, res);
	
	if(!eName) {
		error.end('-108', res);
		return (now === true) ? false : true;
	} 
	
	return ekey.deleteOne({ekeyName: params.ekeyName}).then(e => {
		if(now !== true) error.end('0', res);
		return true;
	}).catch(e => {
		error.end('-106', res, e);
		return (now === true) ? false : true;
	});
};
accept['600037'] = async function delEkeyNow(params, res){
	let add = await accept['600034'](params, res, true);
	if(add)  error.send({uuid: 'uuid'+getRandID()}, res);
	return true;
};

/*********************** 通信关系 ***************************/
























/************************* 字典或通用 *******************************/
accept['600083'] = function dispatch(params={}, res){
	let obj = {endQueryFlag: 1};
	obj.type = params.type || 0;
	obj.lists = dict.cusu;
	error.send(obj, res);
	return true;
};
accept['600000'] = function area(params, res, req){
	let lists = params.type == 1 ? dict.userType : dict.area;
	error.send({lists}, res);
	return true;
};
accept['600093'] = function group(params, res, req){
	error.send({lists: dict.group}, res);
	return true;
};
accept['600122'] = function reviewer(p={}, res, req){
	if(p.reviewer&&p.password) error.end('0', res);
	else error.end('-10', res);
	return true;
};

exports.works = async function(params, req, res){
	// console.log(req.headers.cookie);
	let args = params || {};
	let fn = accept[args.cmdID];
	if(fn) {
		let out = setTimeout(() => { error.end('13', res, '超时'+args.cmdID); }, 2000);
		let bool = await fn(args, res, req);
		if(bool === true) clearTimeout(out);
		else console.log('Async Await');
	} else error.test(res);
};
