!(function(global, factory){
	if ( typeof module === "object" && typeof module.exports === "object" ) {
		module.exports = factory();
	} else if ( typeof define === "function" ) {
		define('utils', factory);
	} else if ( typeof global === 'object' ) {
		global.$utils = factory();
	} else {
		throw new Error( "plugin requires a Object." );
	}
})(this, function(){
	"use strict";
	
	if(Promise){
		const STOP_LOGIC = Symbol(); //构造一个Symbol以表达特殊的语义
		const STOPP_PROMISE = Promise.resolve(STOP_LOGIC);
		// Promise.prototype._then = Promise.prototype.then;
		Promise.stop = () => STOPP_PROMISE;//不是每次返回一个新的Promise，可以节省内存
		Promise.prototype.next = function(onResolve, onReject) {
			return this.then(value => value === STOP_LOGIC ? STOP_LOGIC : onResolve.call(this, value), onReject);
		};
	}
	
	return {
		random (min, max){ //随机数
			if(max < min){
				let num = min;
				min = max;max = num;
			}
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},
		verifyCode (len = 4){ //验证码
			var code = '';
			for (let i = 0; i < len; i++) {
				code += this.random(0, 9);
			}
			return code;
		}
	};
});