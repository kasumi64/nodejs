//cnpm instlal cookie-parser --save

{
	domain: 域名
	name=value：键值对，可以设置要保存的 Key/Value，注意这里的 name 不能和其他属性项的名字一样
	Expires： 过期时间（秒），在设置的某个时间点后该 Cookie 就会失效，如 expires=Wednesday,09-Nov-99 23:12:40 GMT
	maxAge： 最大失效时间（毫秒），设置在多少后失效
	secure： 当 secure 值为 true 时，cookie 在 HTTP 中是无效，在 HTTPS 中才有效
	Path： 表示 cookie 影响到的路，如 path=/。如果路径不能匹配时，浏览器则不发送这个 Cookie
	httpOnly：是微软对 COOKIE 做的扩展。如果在 COOKIE 中设置了“httpOnly”属性，则通过程序（JS脚本、applet 等）将无法读取到COOKIE 信息，防止 XSS 攻击产生
	singed：表示是否签名cookie, 设为true 会对这个 cookie 签名，这样就需要用
	res.signedCookies 而不是 res.cookies 访问它。被篡改的签名 cookie 会被服务器拒绝，并且 cookie值会重置为它的原始值
}

设置 cookie
	res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true, domain: '.nodejs.com'})
	res.cookie('name', 'tobi', { domain: '.example.com', path: '/admin', secure: true });
	res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly:true });

获取 cookie
	req.cookies.name

删除 cookie
	res.cookie('rememberme', '', { expires: new Date(0)});
	res.cookie('username','zhangsan',{domain:'.ccc.com',maxAge:0,httpOnly:true});