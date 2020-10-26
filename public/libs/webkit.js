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
			return this.then(value => value === STOP_LOGIC ? STOP_LOGIC : (onResolve instanceof Function ?  onResolve.call(this, value) : value), onReject);
		};
	}
	
	const Iface = Object.create(null);
	
	const hasOwn = Object.prototype.hasOwnProperty;
	//属性是否来自于对象本身
	Iface.isOwn = (obj, prop) => {
		return hasOwn.call(obj, prop);
	};
	//属性是否来自于对象的原型链
	Iface.isProto = (obj, prop) => {
		return !hasOwn.call(obj, prop) && prop in obj;
	};
	
	Iface.copyJson = function(obj) {
		var length = arguments.length;
		if(length == 1) return JSON.parse(JSON.stringify(obj));
		var i, str, json = JSON.stringify(obj).replace(/^\{|\}$/g, '');
		for (i = 1; i < length; i++) {
			str = JSON.stringify(arguments[i]).replace(/^\{|\}$/g, '');
			if(str) json += ',' + str;
		}
		json = json.replace(/^,+/, '');
		return JSON.parse('{' + json + '}');
	};
	
	function clone(){
		var target, i, length = arguments.length, item, k, prop, val, copy;
			
		if(length == 1){
			i = 0;
			target = Object.create(null);
		} else if(length > 1) {
			i = 1;
			target = arguments[0];
			if(typeof(target) != "object") target = Object.create(null);
		} else return Object.create(null);
		
		for (; i < length; i++) {
			if( (item = arguments[i]) ){
				for (k in item) {
					if( !hasOwn.call(item, k) ) continue;
					prop = target[k];
					val = item[k];
					if(prop === val) continue;
					if(val && typeof(val)=="object"){
						if(val instanceof Array){
							copy = (prop instanceof Array) ? prop : [];
						} else copy = typeof(prop)=="object" ? prop : {};
						target[k] = clone(copy, val);
					} else if(val != null) target[k] = val;
				}
			}
		}
		return target;
	}
	
	Iface.clone = clone;
	
	Iface.noRepeat = (array, property) => {
		var i, len = array.length;
		var unique = [], hashmap = {};
		for(i = 0; i < len; i++){
			let obj = array[i];
			if(property && typeof(obj)=="object") obj = obj[property];
			if(obj === void 0) continue;
			if(!hasOwn.call(hashmap, obj)){
				unique.push(array[i]);
				hashmap[obj] = 1;
			}
		}
		return unique;
	}
	
	Iface.random = function(min, max) { //随机数
		if(max < min){
			let num = min;
			min = max;max = num;
		}
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	Iface.verifyCode = function(len = 4) { //验证码
		var code = '';
		for (let i = 0; i < len; i++) {
			code += this.random(0, 9);
		}
		return code;
	};
	Iface.randomName = function() {
		var sur = [
			"赵", "钱", "孙", "李", "周", "吴", "郑", "王", "冯", "陈",
			"褚", "卫", "蒋", "沈", "韩", "杨", "朱", "秦", "尤", "许",
			"何", "吕", "施", "张", "孔", "曹", "严", "华", "金", "魏", 
			"陶", "姜", "戚", "谢", "邹", "喻", "柏", "水", "窦", "章",
			"云", "苏", "潘", "葛", "奚", "范", "彭", "郎", "鲁", "韦", 
			"昌", "马", "苗", "凤", "花", "方", "俞", "任", "袁", "柳",
			"酆", "鲍", "史", "唐", "费", "廉", "岑", "薛", "雷", "贺", 
			"倪", "汤", "滕", "殷", "罗", "毕", "郝", "邬", "安", "常",
			"乐", "于", "时", "傅", "皮", "卞", "齐", "康", "伍", "余", 
			"元", "卜", "顾", "孟", "平", "黄", "和", "穆", "萧", "尹",
		];
		var name = [
			"子璇", "淼", "国栋", "夫子", "瑞堂", "甜", "敏", "尚", "国贤", "贺祥", "晨涛", 
			"昊轩", "易轩", "益辰", "益帆", "益冉", "瑾春", "瑾昆", "春齐", "杨", "文昊", 
			"东东", "雄霖", "浩晨", "熙涵", "溶溶", "冰枫", "欣欣", "宜豪", "欣慧", "建政", 
			"美欣", "淑慧", "文轩", "文杰", "欣源", "忠林", "榕润", "欣汝", "慧嘉", "新建", 
			"建林", "亦菲", "林", "冰洁", "佳欣", "涵涵", "禹辰", "淳美", "泽惠", "伟洋", 
			"涵越", "润丽", "翔", "淑华", "晶莹", "凌晶", "苒溪", "雨涵", "嘉怡", "佳毅", 
			"子辰", "佳琪", "紫轩", "瑞辰", "昕蕊", "萌", "明远", "欣宜", "泽远", "欣怡", 
			"佳怡", "佳惠", "晨茜", "晨璐", "运昊", "汝鑫", "淑君", "晶滢", "润莎", "榕汕", 
			"佳钰", "佳玉", "晓庆", "一鸣", "语晨", "添池", "添昊", "雨泽", "雅晗", "雅涵", 
			"清妍", "诗悦", "嘉乐", "晨涵", "天赫", "玥傲", "佳昊", "天昊", "萌萌", "若萌"
		];
		
		return sur[this.random(0, 99)] +  name[this.random(0, 100)];
	};
	
	return Iface;
});