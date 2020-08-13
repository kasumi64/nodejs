const path = require('path');
const mime = require('./mime.js');


function pingCookie(cookie){
	let cook = {
		domain: 'http://127.0.0.1/',//域名
		// name=value：键值对，可以设置要保存的 Key/Value，注意这里的 name 不能和其他属性项的名字一样
		Expires: 'Wednesday',//过期时间（秒），在设置的某个时间点后该 Cookie 就会失效，如 expires=Wednesday,09-Nov-99 23:12:40 GMT
		MaxAge: Date.now() + 7 * 24 * 3600 * 1000,//最大失效时间（毫秒），设置在多少后失效
		Secure: false,//当 secure 值为 true 时，cookie 在 HTTP 中是无效，在 HTTPS 中才有效
		Path: '/',//表示 cookie 影响到的路，如 path=/。如果路径不能匹配时，浏览器则不发送这个 Cookie
		HttpOnly: false,//是微软对 COOKIE 做的扩展。如果在 COOKIE 中设置了“httpOnly”属性，则通过程序（JS脚本、applet 等）将无法读取到COOKIE 信息，防止 XSS 攻击产生
		Singed: false//表示是否签名cookie, 设为true 会对这个 cookie 签名，这样就需要用res.signedCookies 而不是 res.cookies 访问它。被篡改的签名 cookie 会被服务器拒绝，并且 cookie值会重置为它的原始值
	};
	cookie = Object.assign(cook, cookie);
	return toString(cookie);
}

function toString(obj){
	if(typeof(obj) == "string") return obj;
	else if(typeof(obj) != "object") return '';
	
	let str = '', k;
	for (let k in obj){
		str += `&${k}=${obj[k]}`;
	}
	return str.replace('&', '');
}

exports.type = function type(str){
	let type = mime[str] || "text/html";
	return type;
}

exports.write = function writeHead(req, res, ext, cookie){
	let type = mime[ext || path.extname(req.url)]  || 'application/json';
	
	let head = {
		'Content-Type': type + ';charset=utf-8;',
		'Access-Control-Allow-Origin': '*',
		"Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS,HEAD,PATCH,CONNECT,TRACE",
		'Access-Control-Allow-Headers': 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type' + 
			',Date,Server,X-Powered-By,Content-Length,Connection,Expires,Last-Modified,Pragma,Content-Disposition',
		// "Access-Control-Max-Age": 604800, //预检请求的有效期，单位为秒(7天)
		// 'Access-Control-Allow-Credentials': true,
		// 'Access-Control-Expose-Headers': 'Location',
		'Connection': 'keep-alive',
		// "Content-Disposition": "attachment",
		// "Pragma": "No-cache",
		// "Cache-Control": "No-cache",
		// "Expires": 0,
		// 'Set-Cookie': 'session=abcdefg;Path=/;'
	}
	if(typeof(cookie)=="object") {
		head.Cookie = head['Set-Cookie'] = pingCookie(cookie);
	}
	// console.log(head['Set-Cookie']);
	res.writeHead(200, head);
}

exports.set = function setHeader(obj, res){
	for (let k in obj) res.setHeader(k, obj[k]);
	return this;
}
