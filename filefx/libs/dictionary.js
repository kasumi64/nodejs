var exp = {};

//用户类型
exp.userType = [
	{id: '1', name: '银行'},{id: '2', name: '证券'},{id: '3', name: '基金'},
	{id: '4', name: '期货'},{id: '5', name: '保险'},{id: '6', name: '信托'},
	{id: '7', name: '监管机构'},{id: '8', name: '其它'},{id: '9', name: '测试'}
];

//所属地区
exp.area = [
	{id: 'ShenZhen', name: '深圳'},{id: 'BeiJing', name: '北京'},
	{id: 'HaingHai', name: '上海'},{id: 'GuangZhou', name: '广州'}
];

//所在组
exp.group = [
	{groupID: 'CU-1'}, {groupID: 'CU-2'},
	{groupID: 'SU-1'}, {groupID: 'XZ-1'},
];

//CU,SU
exp.cusu = [
	{nodeName:'深圳', cuName:'CU-2', errcode:'0', errinfo: 'ok', operationType:'用户'},
	{nodeName:'北京', cuName:'CU-1', errcode:'0', errinfo: 'ok', operationType:'用户'},
	{nodeName:'上海', cuName:'SU-1', errcode:'1', errinfo: 'call rpc:failed', operationType:'用户'},
	{nodeName:'广州', cuName:'XZ-1', errcode:'0', errinfo: 'ok', operationType:'用户'}
];

module.exports = exp;
