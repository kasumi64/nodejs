var msg =  require('../language/msg.js');
var exp = {};

var _classType = {};  //用于记录[object class]样式
(function(fns){
	var typeStr = 'Boolean Number String Function Array Date RegExp Null Undefined',
		typeArr = typeStr.split(' '),
		i, len = typeArr.length;
	for (i = 0; i < len; i++)
	    _classType[ "[object " + typeArr[i] + "]" ] = typeArr[i].toLowerCase();
}());
exp.type = function (value) {
    if (value === null) return 'null';//ie6
    if (value === undefined) return 'undefined';//ie6
	var toString = Object.prototype.toString;
    var typeString = _classType[value.constructor]||_classType[toString.call(value)]||'object';
//	    console.log(_classType[value.constructor],' - ',value.constructor);

	return typeString;
};
function _isFn(fn) { return (fn instanceof Function); }
function _isObject(obj) { return exp.type(obj) == 'object'; }

function _compile(code) {
    var i, len = code.length, c = String.fromCharCode(code.charCodeAt(0) + len);
    for(i = 1; i < len; i++) 
        c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
	return c;
}
function _uncompile(code) {
	var i, len = code.length, c = String.fromCharCode(code.charCodeAt(0) - len);
    for(i = 1; i < len; i++) 
        c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
    return c;
}
	
exp.extend = function() {
	var length, target, i, options, 
		keys, attr, val, copy, isArr;
	length = arguments.length;
	if(length == 1){
		target = this;
		i = 0;
	} else {
		target =arguments[0] || {};
		i = 1;
	}
	for (; i < length; i++) {
		if(options = arguments[i]){
			for(keys in options){
				attr = target[keys];
				val = options[keys];
				if ( target === val ) continue;
				if(val&&(_isObject(val)||(isArr=(val instanceof Array)))){
					if ( !isArr ) {
						copy = _isObject( attr ) ? attr : {};
					} else copy = (attr instanceof Array) ? attr : [];
					target[keys] = exp.extend(copy, val);
				} else if(val != null) target[keys] = val;
			}
		}
	}
	return target;
};
exp.errcode = function(code, res, err){
	res.writeHead(200, {
		'Content-Type': 'application/json;charset=utf-8;',
		'Access-Control-Allow-Origin': '*',
	});
	var obj = msg.errinfo(code, 'errcn');
	res.end( JSON.stringify(obj) );
	console.log(err);
}

module.exports = exp;