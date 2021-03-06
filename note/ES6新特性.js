
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy
let p = new Proxy(target, handler);
Proxy.revocable(); //创建一个可撤销的Proxy对象。
let validator = {
	set: function(obj, prop, value) {
		if(prop === 'age') {
			if(!Number.isInteger(value)) {
				throw new TypeError('The age is not an integer');
			}
			if(value > 200) {
				throw new RangeError('The age seems invalid');
			}
		}
		// The default behavior to store the value
		obj[prop] = value;
	}
};

let person = new Proxy({}, validator);
person.age = 100;
console.log(person.age); // 100
person.age = 'young';
// 抛出异常: Uncaught TypeError: The age is not an integer
person.age = 300;
// 抛出异常: Uncaught RangeError: The age seems invalid

Reflect
//（1）将Object对象的属于语言内部的方法放到Reflect对象上，即从Reflect对象上拿Object对象内部方法。
//（2）将用 老Object方法 报错的情况，改为返回false
//（4）Reflect与Proxy是相辅相成的，在Proxy上有的方法，在Reflect就一定有

const myFirstPromise = new Promise((resolve, reject) => {
	// ?做一些异步操作，最终会调用下面两者之一:
	//
	//   resolve(someValue); // fulfilled
	// ?或
	//   reject("failure reason"); // rejected
});

function defineProperties(obj, properties) {
	function convertToDescriptor(desc) {
		function hasProperty(obj, prop) {
			return Object.prototype.hasOwnProperty.call(obj, prop);
		}

		function isCallable(v) {
			// NB: modify as necessary if other values than functions are callable.
			return typeof v === 'function';
		}

		if(typeof desc !== 'object' || desc === null)
			throw new TypeError('bad desc');

		var d = {};

		if(hasProperty(desc, 'enumerable'))
			d.enumerable = !!desc.enumerable;
		if(hasProperty(desc, 'configurable'))
			d.configurable = !!desc.configurable;
		if(hasProperty(desc, 'value'))
			d.value = desc.value;
		if(hasProperty(desc, 'writable'))
			d.writable = !!desc.writable;
		if(hasProperty(desc, 'get')) {
			var g = desc.get;

			if(!isCallable(g) && typeof g !== 'undefined')
				throw new TypeError('bad get');
			d.get = g;
		}
		if(hasProperty(desc, 'set')) {
			var s = desc.set;
			if(!isCallable(s) && typeof s !== 'undefined')
				throw new TypeError('bad set');
			d.set = s;
		}

		if(('get' in d || 'set' in d) && ('value' in d || 'writable' in d))
			throw new TypeError('identity-confused descriptor');

		return d;
	}

	if(typeof obj !== 'object' || obj === null)
		throw new TypeError('bad obj');

	properties = Object(properties);

	var keys = Object.keys(properties);
	var descs = [];

	for(var i = 0; i < keys.length; i++)
		descs.push([keys[i], convertToDescriptor(properties[keys[i]])]);

	for(var i = 0; i < descs.length; i++)
		Object.defineProperty(obj, descs[i][0], descs[i][1]);

	return obj;
}