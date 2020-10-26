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
	{groupID: 'CU-1'}, {groupID: 'CU-2'}, {groupID: 'CU-13'},
	{groupID: 'SU-1'}, {groupID: 'XZ-1'}, {groupID: 'SU-10'}
];
//操作类型
exp.operationType = [
	{id: 'add_comm', name: '增加通信关系'},
	{id: 'add_comm_now',  name: '增加通信关系立即下发'},
	{id: 'add_ekey',  name: '增加Ekey'},
	{id: 'add_ekey_now',  name: '增加Ekey立即下发'},
	{id: 'add_ext',  name: '增加扩展信息'},
	{id: 'add_userInfo',  name: '增加用户基础信息'},
	{id: 'add_userInfo_now',  name: '增加用户基础信息立即下发'},
	{id: 'create_big_version',  name: '生成大版本'},
	{id: 'del_client_file',  name: '删除客户端文件'},
	{id: 'del_comm',  name: '删除通信关系'},
	{id: 'del_ekey',  name: '删除Ekey'},
	{id: 'del_ekey_now',  name: '删除Ekey立即下发'},
	{id: 'del_ext',  name: '删除扩展信息'},
	{id: 'del_userinfo',  name: '删除用户基础信息'},
	{id: 'dispatch_client_file',  name: '分发客户端部署包文件'},
	{id: 'dispatch_cu',  name: '分发给CU'},
	{id: 'dispatch_webu',  name: '分发webu'},
	{id: 'emerg_lock',  name: '运维锁定'},
	{id: 'emerg_unlock',  name: '运维解锁'},
	{id: 'import_ext_ope',  name: '导入扩展信息'},
	{id: 'import_ext_bop',  name: '导入BOP表'},
	{id: 'auto_get_zdcfg',  name: '自动获取中登配置文件'},
	{id: 'manual_get_zdcfg',  name: '手获取中登配置文件'},
	{id: 'modify_dcfg',  name: '修改系统动态配置文件'},
	{id: 'modify_scfg',  name: '修改系统静态配置文件'},
	{id: 'modify_ekey',  name: '修改Ekey'},
	{id: 'modify_ekey_now',  name: '修改Ekey立即下发'},
	{id: 'modify_ext_ope',  name: '修改扩展信息'},
	{id: 'modify_password',  name: '修改密码'},
	{id: 'modify_password_now',  name: '修改密码立即下发'},
	{id: 'modify_userinfo',  name: '修改用户基础信息'},
	{id: 'modify_userinfo_now',  name: '修改用户基础信息立即下发'},
	{id: 'recover_client_file',  name: '客户端文件对比恢复'},
	{id: 'rollback_version',  name: '版本回滚'},
	{id: 'set_blacklist',  name: '设置黑名单'}
];
//CU,SU
exp.cusu = [
	{nodeName:'深圳', cuName:'CU-2', errcode:'0', errinfo: 'ok', operationType:'增加通信关系'},
	{nodeName:'北京', cuName:'CU-1', errcode:'0', errinfo: 'ok', operationType:'用户'},
	{nodeName:'上海', cuName:'SU-1', errcode:'1', errinfo: 'call rpc:failed', operationType:'运维'},
	{nodeName:'广州', cuName:'XZ-1', errcode:'0', errinfo: 'ok', operationType:'扩展信息'},
	{nodeName:'北京', cuName:'CU-13', errcode:'0', errinfo: 'ok', operationType:'用户'},
	{nodeName:'广州', cuName:'XZ-10', errcode:'0', errinfo: 'ok', operationType:'扩展信息'},
];

module.exports = exp;
