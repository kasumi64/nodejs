var errcn = require('./err-zh-cn.js');
var info = {errcn};

module.exports = {
	errinfo: function(code, lang){
		var msg = info[lang||'errcn'][code]
		if(!msg) return {code: -1, errinfo: '请求失败！'};
		return {code, errinfo: msg};
	}
};