define('utils', function (require, exports, module)
{
	var kit = require('main/kit'), axios = require('axios'), exp = exports;
	
	//请求，通信
	var urlIP = 'http://127.0.0.1/json';
	exp.axios = function(args, fn, err){
		var param = {url:urlIP};
		if(typeof(args)=="string"){
			param.method = 'post';
			param.data = args;
		} else {
			param.method = args.method||'post';
			delete args.method;
			param.data = args;
		}
		axios(param).then(function(response){
//			console.log(response);
			if(response.status!=200) return console.warn(response);
			var data = response.data, args = JSON.parse(response.config.data);
			if(fn instanceof Function) fn(data, args);
		}).catch(function(e){
			console.warn(e);
			if(err instanceof Function) err(e);
		});
	}
	exp.post = function(args, fn, err){
		args.method = 'post';
		exp.axios(args, fn, err);
	}
	exp.get = function(args, fn, err){
		args.method = 'get';
		exp.axios(args, fn, err);
	}
	
	//提示
	function MessageTips(){
		var weakHtml = '<div id="_weakTips"><div class="_panle"><div class="_container"></div></div></div>';
		var weakTips = {el: kit(weakHtml), time: 0};
		weakTips.el.css({
			position:'fixed', top:0, left:0,
			width:'100%', height:'100%', 'font-size':0,
			'text-align': 'center', 'z-index':1
		}).click(function(e){
			if(e.target==this) weakTips.el.detach();
		});
		weakTips._panle = weakTips.el.find('._panle').css({
			display:'inline-block', padding:'56px 30px', top:100,
			'max-width':500, 'min-width':328, 'min-height':132,
			'border-radius':8, background:'rgba(38,38,38,0.7)', transform:'translateY(50%)'
		});
		weakTips.txt = weakTips.el.find('._container').css({
			'font-size':'14px', 'line-height':'20px',
			color:'#FFF', 'white-space':'normal'
		});
		weakTips.show = function(txt, time){
			this.txt[0].innerHTML = txt;
			kit.body().appendChild(this.el[0]);
			if(typeof(time)!="number") time = 5000;
			if(time > 0){
				clearTimeout(this.time);
				this.time = setTimeout(this.hide, time);
			}
		};
		weakTips.hide = function(){
			weakTips.el.detach();
			clearTimeout(weakTips.time);
		};
		this.weakTips = function(txt, time){
			weakTips.show(txt, time);
			return this;
		}
	};
	kit.extend(exp, new MessageTips());
	
	//数据存取
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
	function _toStr(obj){ return JSON.stringify(obj); }
	function _toJson(str){ return JSON.parse(str); }
	var _storage = {
		set : function(val) {
			if(kit.isObject(val)) val = _toStr(val) + '^~Obj';
			else val += '^~Str';
			return _compile(_compile(val));
		}, get : function(val) {
			if(!val) return '';
			val = _uncompile(_uncompile(val)).split('^~', 2);
			if(val[1] == 'Obj') val[0] = _toJson(val[0]);
			return val[0]
		}, clear : function(stor, keys) {
			if(keys) stor.removeItem(keys);
			else stor.clear();
		}, keys : function(stor) {
			var i, len = stor.length, arr = [];
			for(i = 0; i < len; i++) arr.push(stor.key(i));
			return arr;
		}
	};
	exp.local = {};
	exp.local.set = function(keys, val) {
		localStorage.setItem(keys, _storage.set(val));
	};
	exp.local.get = function(keys) {
		var val = localStorage.getItem(keys);
		return _storage.get(val);
	};
	exp.local.clear = function(keys) {
		_storage.clear(localStorage, keys);
	};
	exp.local.keys = function() {
		return _storage.keys(localStorage);
	};
	
	exp.session = {};
	exp.session.set = function(keys, val) {
		sessionStorage.setItem(keys, _storage.set(val));
	};
	exp.session.get = function(keys) {
		var val = sessionStorage.getItem(keys);
		return _storage.get(val);
	};
	exp.session.clear = function(keys) {
		_storage.clear(sessionStorage, keys);
	};
	exp.session.keys = function() {
		return _storage.keys(sessionStorage);
	};
	
	//解析html
	function analyzeHtml(html, view){
		var app = doc.getElementById('app');
		var data = html.replace(/(<!--[\s\S]+?-->)|(\/\*[\s\S]+?\*\/)|(\/\/.+)/g,'');
		var fr = doc.createDocumentFragment(), code=[],count=0;
		data = data.replace(/<script[\s\S]+?script>/igm, function(str){
			var src = (/<script.+?src=['"]{0,1}(.+?\.js)/igm).exec(str);
			if(src){
				var es = doc.createElement('script');
				es.src = src[1];
				es.onload = es.onerror = finish;
				fr.appendChild(es);
			} else {
				src = (/<scrip[\s\S]+?>([\s\S]+)<\/script>/igm).exec(str);
				if(src) code.push(src[1]);
			}
			return '';
		});

		app.innerHTML = data;
		var max = fr.children.length;
		app.appendChild(fr);
		
		function finish(){
			if(++count!=max) return;
			try{
				for (var i = 0; i < code.length; i++) eval(code[i]);
			}catch(e){console.log(e);}
		}
	}
	
});
