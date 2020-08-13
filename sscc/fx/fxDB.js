var mongo = require('@sscc/libs/ctrlDB.js'),
	dict = require('@sscc/libs/dictionary.js'),
	error =  require('@sscc/libs/error.js');
	
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
accept['600001'] = function userList(params, res, req, isAdvanced){
	if(typeof params != 'object') return error.end('-10', res, '600001');
	
	let query = {}, fields = {};
	if(params.userID) query.userID = new RegExp(params.userID, 'i');
	if(params.userName) query.userName = new RegExp(params.userName, 'i');
	
	// if(params.userID) query.userID = {'$regex':params.userID, '$options':"$i"}
	
	if(isAdvanced){
		query = isAdvanced;
	} else fields = {userID: 1, userName:1};
	
	account.getList(query, params, fields).then(result => {
		let msg = Object.assign(error.getMsg('0'), result);
		res.write( JSON.stringify(msg) );
		res.end();
	}).catch(e=>{ error.end('-1', res) });
	return true;
};
accept['600051'] = function (params = {}, res, req){
	let query = {};
	if(params.userID) query.userID = new RegExp(params.userID, 'gi');
	if(params.userName) query.userName = new RegExp(params.userName, 'gi');
	if(params.userType != '') query.userType = params.userType;
	if(params.inZone != 'all') query.inZone = params.inZone;
	if(params.linkGroupName != 'all') query.linkGroupName = params.linkGroupName;
	
	accept['600001'](params, res, req,query);
	return true;
};

async function getUser(params, res, fields){
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

accept['600002'] = async function getList (params, res){
	let user = await getUser(params, res);
	if(user) error.send({lists: [user]}, res);
	return true;
};
accept['600003'] = async function addUser(params, res, now){
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
accept['600006'] = async function addUserNow(params, res){
	let add = await accept['600003'](params, res, true);
	if(add)  error.send({uuid: 'uuid'+getRandID()}, res);
	return true;
};

async function checkID(params, res){
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
		if(now !== true) error.send({webUserFlag: 1}, res);
		return true;
	}).catch(e => {
		error.end('-103', res, e);
		return (now === true) ? false : true;
	});
};
accept['600007'] = async function updateUserNow(params, res){
	let add = await accept['600004'](params, res, true);
	if(add)  error.send({uuid: 'uuid'+getRandID(), webUserFlag: 1}, res);
	return true;
};
accept['600005'] = async function deleteUser(params = {}, res, req){
	if(typeof(params.userID)!="string") return  error.end('-10', res, '600005');
	let fields = {userID: params.userID};
	await account.deleteOne(fields).catch(e => { error.end('-105', res, e); });
	await ekey.remove(fields).catch(e => { error.end('-105', res, e); });
	fields = {userID1: params.userID};
	await signal.remove(fields).catch(e => { error.end('-105', res, e); });
	error.end('0', res);
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
accept['600010'] = async function modifyPwdNow(params, res){
	let add = await accept['600009'](params, res, true);
	if(add)  error.send({uuid: 'uuid'+getRandID()}, res);
	return true;
};
accept['600011'] = async function expiredTime(params, res){
	let user = await getUser(params, res, {userpasswdExpiredFlag: 1});
	if(!user) return true;
	let userpasswdExpiredFlag = user.userpasswdExpiredFlag || '1';
	error.send({userpasswdExpiredFlag}, res);
	return true;
};
accept['600012'] = function defaultPasswd(params, res){
	error.send({defaultPasswd: '123456'}, res);
	return true;
};

/******************************** 扩展信息 *************************************/

accept['600021'] = async function addOperator(params, res){
	let user = await getUser({userID:params.userID}, res, {userName: 1});
	let name = await information.findOne({operatorName: params.operatorName}, {projection: {operatorName: 1}});
	if(!user) {
		error.end('-104', res);
		return true;
	}
	if(name){
		error.end('-110', res);
		return true;
	}
	
	params.userName = user.userName;
	params.createTimestamp = Date.now() + getRandID();
	information.insertOne(params).then(result => {
		error.end('0', res);
	}).catch(e => {
		error.end('-106', res, e);
	});
	return true;
};
accept['600022'] = function deleteOperator(params, res){
	information.deleteOne({userID: params.userID, operatorName: params.operatorName});
	error.end('0', res);
	return true;
};
accept['600023'] = async function modifyOperator(params, res){
	let user = await getUser({userID:params.userID}, res, {userName: 1});
	if(!user) {
		error.end('-104', res);
		return true;
	}
	information.updateOne({userID:params.userID, operatorName: params.oldOperatorName}, params);
	error.end('0', res);
	return true;
};
accept['600024'] = function queryOperator(params, res){
	params.pageSize = 500;
	information.getList({userID: params.userID}, params).then(result => {
		result.count = result.totalSize;
		error.send(result, res); 
	}).catch(e=>{
		error.end('-102', res, e); 
	});
	return true;
};
accept['600025'] = accept['600024'];
accept['600054'] = async function addOperator(params, res){
	let query = {}, {userID, userName, opeartorCompany, ssccManager} = params;
	// console.log(userID, userName, opeartorCompany, ssccManager);
	
	query.userID = userID || {'!=': void 0};
	if(userName) query.userName = new RegExp(userName, 'i');
	if(opeartorCompany) query.operatorCompany = new RegExp(opeartorCompany, 'i');
	if(ssccManager) query.ssccManager = new RegExp(ssccManager, 'i');
	
	information.getList(query, params).then(result => {
		error.send(result, res); 
	}).catch(e=>{
		error.end('-102', res, e); 
	});
	return true;
};
accept['600057'] = accept['600054'];


/******************************** Ekey *************************************/

accept['600031'] = function EkeyList(params, res){
	if(typeof params != 'object') return error.end('-10', res, '600031');
	let query = {};
	if(params.userID) query.userID = new RegExp(params.userID, 'gi');
	if(params.ekeyName) query.ekeyName = new RegExp(params.ekeyName, 'gi');
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

accept['600041'] = function signalList(params, res){
	if(typeof params != 'object') return error.end('-10', res, '600041');
	let query = {};
	if(params.userID1) query.userID1 = new RegExp(params.userID1, 'gi');
	if(params.userID2) query.userID2 = new RegExp(params.userID2, 'gi');
	signal.getList(query, params).then(result => {
		let msg = Object.assign(error.getMsg('0'), result);
		res.write(JSON.stringify(msg));
		res.end();
	});
	return true;
};
accept['600053'] = accept['600041'];
accept['600042'] = async function addSignal(params, res, now){
	if(typeof params != 'object') return error.end('-10', res, '600042');
	let fields = {userID: 1, userName: 1};
	let user = await getUser({userID: params.userID1}, res, fields);
	let arr = params.lists || [];
	if(arr.length == 0||!user) {
		error.end('-106', res);
		return (now === true) ? false : true; 
	}
	
	let item, other, list = [];
	other = await signal.find({ userID1: params.userID1, userID2: {$in: arr} });
	let isAll = other.length == 0;
	if(!isAll){
		let arrStr = '-'+arr.join('-');
		for (let i = 0; i < other.length; i++) {
			let reg = new RegExp('-'+other[i].userID2,'g');
			arrStr = arrStr.replace(reg, '');
		}
		arr = arrStr.replace(/^-/, '').split('-');
	}
	for (let i = 0; i < arr.length; i++) {
		item = await account.findOne({userID: arr[i]}, fields).catch(e => {
			return null;
		});
		
		if(item) {
			let obj = {userID1: user.userID, userName1: user.userName};
			obj.userID2 = item.userID;
			obj.userName2 = item.userName;
			obj.commConfigDate = Date.now();
			list.push(obj);
		}
	}
	
	if(list.length == 0) {
		if(now !== true) error.end('1', res);
		return true;
	}
	
	return signal.insertMany(list).then(e => {
		if(now !== true) {
			error.end(isAll ? '0' : '1', res);
		}
		return true;
	}).catch(e => {
		error.end('-106', res, e);
		return (now === true) ? false : true;
	});
};
accept['600044'] = async function addSignalNow(params, res){
	params.lists = [params.userID2];
	let add = await accept['600042'](params, res, true);
	if(add)  error.send({uuid: 'uuid'+getRandID()}, res);
	return true;
};
accept['600043'] = async function dellSignal(params, res){
	let list = params.lists;
	if(!list||list.length==0) return error.end('-10', res, '600043');
	
	let fields = {}, obj;
	for (let i = 0; i < list.length; i++) {
		obj = list[i];
		if(!fields[obj.userID1]) fields[obj.userID1] = {$in:[]};
		fields[obj.userID1].$in.push(obj.userID2);
	}
	// console.log(fields);
	for (let k in fields) {
		obj = {userID1: k, userID2:fields[k]};
		await signal.remove(obj).catch(e => { error.end('-105', res, e); });
	}
	error.end('0', res);
	return true
};


/************************* 主机配置 *******************************/
accept['600091'] = async function getCfgInfo(params, res, interior){
	// let hc = fs.readFileSync('./filefx/hostConfig.json');
	// error.send({cfgInfo: hc+''}, res);
	let query = {}
	if(params.type == 0) query.fxConfig = 'staticConfig';
	else query.fxConfig = 'dynamicConfig';
	information.findOne(query, {projection:{cfgInfo: 1}}).then(result => {
		error.send({cfgInfo:result.cfgInfo}, res);
	}).catch(e => {
		error.end('-102', res, e);
	});
	return true;
};
accept['600094'] = async function compareCfgInfo(params, res){
	let hc = fs.readFileSync('./filefx/hostConfig.json');
	try{
		hc = JSON.parse(hc+'');
		var cfgInfo = JSON.parse(params.cfgInfo);
	}catch(e){
		error.end('-109', res);
		return true;
	}
	let lists = compare(hc, cfgInfo);
	error.send({lists}, res);
	return true;
};
//对比
function compare(hc, data){
	let k, i, oItem, nItem
	var df = [];
	for (k in hc) { //原有字段
		oItem = hc[k], nItem = data[k];
		let txt1 = JSON.stringify(oItem), txt2 = JSON.stringify(nItem);
		if(txt1 == txt2) {
			delete data[k];
			continue;
		}
		
		let type1 = getType(oItem), type2 = getType(nItem);
		
		if(nItem){ //Modify
			if(typeof(oItem)!='object' && typeof(nItem)!='object'){
				df.push({section:k, field:k, type: 'Modify', detail: `${oItem}->${nItem}`});
			} else if(typeof(oItem)=='object' && typeof(nItem)!='object'){ //从{}修改到str
				df.push({section:k, field:k, type: 'ADD', detail: nItem});
				diff(oItem, null, k, df);
			} else if(typeof(oItem)!='object' && typeof(nItem)=='object'){ //从str修改到{}
				df.push({section:k, field:k, type: 'DEl', detail: oItem});
				diff(null, nItem, k, df);
			} else diff(oItem, nItem, k, df);
		} else { //新字段没有值 del
			if(typeof oItem == 'object'){
				diff(oItem, null, k, df);
			} else df.push({section:k, field:k, type: 'DEL', detail: oItem});
		}
		delete data[k];
	}
	// console.log(data);
	for (k in data) { //新加字段
		oItem = data[k];
		if(typeof oItem == 'object'){
			diff(null, oItem, k, df);
		} else df.push({section:k, field:k, type: 'ADD', detail: oItem});
	}
	// console.log(df);
	return df;
}
//找出不同的字段，one为旧的，two为新的
function diff(one, two, section, list){
	let k, obj
	if(two == null){ // 旧的del
		for (k in one) {
			obj = one[k];
			if(typeof(obj)!='object'){
				list.push({section, field:k, type: 'DEL', detail: obj});
			} else diff(obj, null, section, list);
		}
		return list;
	} else if(one == null){ //新的add
		for (k in two) {
			obj = two[k];
			if(typeof(obj)!='object'){
				list.push({section, field:k, type: 'ADD', detail: obj});
			} else diff(null, obj, section, list);
		}
		return list;
	}
	
	for (k in one) { //比对修改值
		let ob1 = one[k],  ob2= two[k],
			txt1 = JSON.stringify(ob1),
			txt2 = JSON.stringify(ob2);
		
		if(txt1 == txt2) {
			delete two[k];
			continue;
		}
		
		if(ob2){
			if(typeof(ob1)!='object' && typeof(ob2)!='object'){
				list.push({section, field:k, type: 'Modify', detail: `${ob1}->${ob2}`});
			} else if(typeof(ob1)=='object' && typeof(ob2)!='object') {
				list.push({section, field:k, type: 'ADD', detail: ob2});
				diff(ob1, null, section, list);
			} else if(typeof(ob1)!='object' && typeof(ob2)=='object') {
				list.push({section, field:k, type: 'DEL', detail: ob1});
				diff(null, ob2, section, list);
			} else {
				diff(ob1, ob2, section, list);
			}
		} else {
			if(typeof ob1 == 'object'){
				diff(ob1, null, section, list);
			} else list.push({section, field:k, type: 'DEL', detail: ob1});
		}
		delete two[k];
	}
	
	for (k in two) { //新加字段
		obj = two[k];
		if(typeof obj == 'object'){
			diff(null, obj, section, list);
		} else list.push({section, field:k, type: 'ADD', detail: obj});
	}
	
	return list;
}
accept['600092'] = function modifyConfig(params, res){
	try{ 
		JSON.parse(params.cfgInfo);
	}catch(e){
		error.end('-10', res);
		return true;
	}
	let query = {};
	if(params.type==0) query.fxConfig = 'staticConfig';
	else query.fxConfig = 'dynamicConfig';
	information.updateOne(query, params, {upsert: true}).then(e => {
		error.end('0', res);
	}).catch(e => {
		error.end('-103', res, e);
	});
	return true;
};

/************************* 分发稽核 *******************************/
accept['600081'] = async function getNode(params, res){
	let lists, cfg = await information.findOne({fxConfig:'staticConfig'},{projection:{cfgInfo: 1}}).catch(e => {
		error.end('-102', res, e);
	});
	cfg = JSON.parse(cfg.cfgInfo);
	if(params.type == 0){
		let blackList = await information.findOne({cuBlackList: 'cuBlackList'},{projection:{CU:1}}).catch(e => {
			error.end('-102', res, e);
		});
		blackList = blackList.CU;
		lists =  cfg.CU;
		let i, len = blackList.length, cuObj = {}, tmp;
		for (i = 0; i < len; i++) {
			tmp = blackList[i];
			cuObj[tmp.cuName] = tmp.blackFlag;
		}
		for (i = 0, len = lists.length; i < len; i++) {
			tmp = lists[i];
			tmp.blackFlag = cuObj[tmp.cuName];
		}
	} else lists =  cfg.SU;
	error.send({lists}, res);
	return true;
};
accept['600112'] = function lock(params, res){
	information.updateOne({lock: 'fxlock'}, {operationLockStatus: '1'}, {upsert: true});
	error.end('0',res);
	return true;
};
accept['600113'] = function unlock(params, res){
	information.updateOne({lock: 'fxlock'}, {operationLockStatus: '0'}, {upsert: true});
	error.end('0',res);
	return true;
};
accept['600111'] = async function lock(params, res){
	let lock = await information.findOne({lock: 'fxlock'});
	error.send(lock, res);
	return true;
};




/************************* 文件管理 *******************************/
accept['600061'] = async function getFileList(params, res, private){
	let query = {fileName: {'!=': void 0}};
	params.pageSize = 500;
	let result = await information.getList(query, params).catch(e=>{
		error.end('-102', res, e); 
		return {errcode: '-102'};
	});
	result.count = result.totalSize;
	if(private !== true){
		error.send(result, res);
		return true;
	} else return result;
};
accept['600062'] = function dispatchFile(params, res){
	params.dispatchTime = Date.now();
	params.fileMd5 = params.dispatchTime + getRandID();
	information.insertOne(params).then(result => {
		error.send({uuid: 'uuid'+getRandID()}, res);
	}).catch(e => {
		error.end('-106', res, e);
	});
	return true;
};
accept['600063'] = function getFileList(params, res){
	let filter = {
		fileName: params.fileName,
		fileMd5: params.fileMd5
	};
	return information.deleteOne(filter).then(e => {
		error.send({uuid: 'uuid'+getRandID()}, res);
		return true;
	}).catch(e => {
		error.end('-105', res, e);
		return true;
	});
};
accept['600064'] = function recover(params, res){
	error.send({uuid: 'uuid'+getRandID()}, res);
};
accept['600065'] = async function cuCompare(params, res){
	let data = await accept['600061'](params, res, true);
	let cfg = await information.findOne({fxConfig:'staticConfig'}, {projection:{cfgInfo: 1}}).catch(e => {
		error.end('-102', res, e);
		return {cfgInfo: '{"CU": []}'};
	});
	cfg = JSON.parse(cfg.cfgInfo);
	let i, obj, cu = cfg.CU;
	if(cu.length == 0) return true;
	for (i = 0; i < data.lists.length; i++) {
		obj = data.lists[i];
		let str = 'cu is file:[';
		str += cu[random(0, cu.length-1)].cuName;
		str += ', ' + cu[random(0, cu.length-1)].cuName;
		if(i%2) str += ', SUp-10';
		obj.detail = str + ']';
	}
	error.send(data, res);
	return true
};
accept['600067'] = function compareMd5(params, res){
	error.send({lists: [{version:' 1.1.0', fileName: 'file_01',isEqual: 2}]}, res);
};
accept['600066'] = async function cuBlackList(params, res){
	let i, arr = params.lists;
	if(getType(arr)!=='array'||arr.length == 0) {
		error.end('-1', res);
		return true;
	}
	
	let cu = []
	for (i = 0; i < arr.length; i++) {
		let {cuName, nodeName, blackFlag} = arr[i];
		cu.push({cuName, nodeName, blackFlag});
	}
	error.end('0', res);
	
	delete params.lists;
	params.CU = cu;
	information.updateOne({cuBlackList:'cuBlackList'}, params, {upsert: true}).then(e => {
		error.end('0', res);
	}).catch(e => {
		error.end('-103', res, e);
	});
	return true;
};


/************************* 字典或通用 *******************************/
accept['600083'] = function dispatch(params, res){
	let obj = {endQueryFlag: 1};
	obj.type = params.type || 0;
	obj.lists = dict.cusu;
	setTimeout(() => { error.send(obj, res); }, 1000);
	// error.send(obj, res);
	return true;
};
accept['600000'] = function area(params, res, req){
	if(params.type == 1) lists = dict.userType;
	else if(params.type == 2) lists = dict.area;
	else if(params.type == 3) lists = dict.operationType;
	error.send({lists}, res);
	return true;
};
accept['600093'] = function group(params, res, req){
	error.send({lists: dict.group}, res);
	return true;
};
accept['600122'] = function reviewer(p, res, req){
	if(p.reviewer&&p.password) error.end('0', res);
	else error.end('-10', res);
	return true;
};

var aci = 0;
for (let k in accept) {
	aci++
}
console.log(`\n一共实现了${aci}个接口`);

exports.works = async function(params = {}, req, res){
	// console.log(req.headers.cookie);
	let fn = accept[params.cmdID];
	if(fn) {
		let out = setTimeout(() => { error.end('13', res, '超时'+params.cmdID); }, 2000);
		let bool = await fn(params, res, req);
		if(bool === true) clearTimeout(out);
		else console.log('Async Await');
	} else error.test(res);
};

exports.accept = accept;
