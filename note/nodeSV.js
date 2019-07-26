//node.js操作Cookie
//通过node.js建立了一个完整的网站不是一件容易的事，这涉及读取页面模板，从数据库中抽出数据构建成新的页面返回给客户端。但光是这样还不行，我们还要设置首部，在chrome中如果CSS没有设置正确的Content-Type，会不起作用的。此处理还要考虑访问量，要设置缓存，缓存不单单是把东西从内存中读入读出就行，这样会撑爆电脑内存的，这用LRU算法（最近最少用的数据会清空出内存）。基于Cookie与数据库与URL重写，我们发展出一个session机制用于在多个action中通信。对于不同的请求交由不同的action来处理，就要发展出路由机制与MVC系统，等等。我信后写这些东西一点点写出来，揭示newland.js中遇到的种种问题与解决方案。如果什么都贪图方便，直接上框架，对我们语言学习是非常不利的。
//
//本文正如标题所说，是操作Cookie。下面是一个完整的例子：

var http = require('http');
http.createServer(function (req, res) {
    // 获得客户端的Cookie
    var Cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function( Cookie ) {
        var parts = Cookie.split('=');
        Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    console.log(Cookies)
    // 向客户端设置一个Cookie
    res.writeHead(200, {
        'Set-Cookie': 'myCookie=test',
        'Content-Type': 'text/plain'
    });
    res.end('Hello World\n');
}).listen(8000);
 
console.log('Server running at http://127.0.0.1:8000/');
//如果去掉其中几句，就是官方给出的例子，除了表明返回一个页面多简单外，一点用也没有。

var http = require('http');
 
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(8000);
 
console.log('Server running at http://127.0.0.1:8000/');
//我们通过http.createServer的回调来处理所有请求与响应，因此什么有用的东西都在它们上面。Cookie位于req对象的headers对象上，为一个字符串，通常为了方便我们将它们转换成一个对象。
//
//写入一个Cookie其实就是在首部设置一个键值对，上面是简单方式，它实际上可以这样：

res.writeHead(200, {
     'Set-Cookie': ["aaa=bbb","ccc=ddd","eee=fff"],
     'Content-Type': 'text/plain'
 });
//但真正使用时，我们的Cookie并非这样简单的的格式：
//
//Set-Cookie: =[; =] 
//[; expires=][; domain=] 
//[; path=][; secure][; HttpOnly]
//
//HttpOnly 属性： 这是微软对Cookie做的扩展。如果在Cookie中设置了"HttpOnly"属性，那么通过程序(JS脚本、Applet等)将无法读取到Cookie信息，这样能有效的防止XSS攻击。

var http = require('http');
http.createServer(function (req, res) {
    // 获得客户端的Cookie
    var Cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function( Cookie ) {
        var parts = Cookie.split('=');
        Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    console.log(Cookies)
    // 向客户端设置一个Cookie
    res.writeHead(200, {
        'Set-Cookie': 'SSID=Ap4GTEq; Expires=Wed, 13-Jan-2021 22:23:01 GMT;HttpOnly ',
        'Content-Type': 'text/html'
    });
    res.end('Hello World\n<script>console.log(document.Cookie)</script>');
}).listen(8000);
 
console.log('Server running at http://127.0.0.1:8000/');
//然后多刷几次页面，我们发现我们还能在控制台看到SSID=Ap4GTEq这个属性，但在前端我们看不到它（当然在firebug中能看到）。
//
//Secure属性： 当设置为true时，表示创建的 Cookie 会被以安全的形式向服务器传输，也就是只能在 HTTPS 连接中被浏览器传递到服务器端进行会话验证，如果是 HTTP 连接则不会传递该信息，所以不会被窃取到Cookie 的具体内容。同上，在客户端我们也无法在document.Cookie找到被设置了Secure=true的Cookie键值对。Secure属性是防止信息在传递的过程中被监听捕获后信息泄漏，HttpOnly属性的目的是防止程序获取Cookie后进行攻击。我们可以把Secure=true看成比HttpOnly更严格的访问控制。
//
//path属性： 指定可访问Cookie的目录。例如："userId=320; path=/shop";就表示当前Cookie仅能在shop目录下使用。
//
//domain属性： 指定可访问Cookie的主机名.主机名是指同一个域下的不同主机，例如：www.google.com和gmail.google.com就是两个不同的主机名。默认情况下，一个主机中创建的Cookie在另一个主机下是不能被访问的， 但可以通过domain参数来实现对其的控制，其语法格式为："name=value; domain=CookieDomain";以google为例，要实现跨主机访问，可以写为： "name=value;domain=.google.com";这样，所有google.com下的主机都可以访问该Cookie。
//
//Expires属性：指定过期时间，格式为"name=value;; expires=GMT_String"; 其中GMT_String是以GMT格式表示的时间字符串，超过这个时间，Cookie将消失，不可访问。例如：如果要将Cookie设置为10天后过期，可以这样实现：

//获取当前时间
var date=new Date();
var expireDays=10;
//将date设置为10天以后的时间
date.setTime(date.getTime()+expireDays*24*3600*1000);
//将userId和userName两个Cookie设置为10天后过期
 res.writeHead(200, {
        'Set-Cookie': "userId=828; userName=hulk; expire="+date.toGMTString();
        'Content-Type': 'text/html'
   });
//Max-Age属性： 个人感觉这个东西比Expires更好用，本来就是用于代替Expires，由于市面上的书你抄我，我抄你，都在抄旧知识，导致Expires还在使用。Max-Age的值 可以为正数，表示此Cookie从创建到过期所能存在的时间，以秒为单位，此Cookie会存储到客户端电脑，以Cookie文件形式保存，不论关闭浏览器或关闭电脑，直到时间到才会过期。 可以为负数，表示此Cookie只是存储在浏览器内存里，只要关闭浏览器，此Cookie就会消失。maxAge默认值为-1。 还可以为0，表示从客户端电脑或浏览器内存中删除此Cookie。
//
//Cookie面向的主要是服务器，localstorage面向的是页面端js。页面所需的业务数据可以放在localstorage里，但是认证相关的信息还是需要放在Cookie里的。
//
//Cookie的限制
//
//一、浏览器允许每个域名所包含的 Cookie 数：
//
//Microsoft 指出 Internet Explorer 8 增加 Cookie 限制为每个域名 50 个，但 IE7 似乎也允许每个域名 50 个 Cookie（《Update to Internet Explorer’s Cookie Jar》）。
//Firefox 每个域名 Cookie 限制为 50 个。
//Opera 每个域名 Cookie 限制为 30 个。
//Safari/WebKit 貌似没有 Cookie 限制。但是如果 Cookie 很多，则会使 header 大小超过服务器的处理的限制，会导致错误发生。
//二、当很多的 Cookie 被设置，浏览器如何去响应。除 Safari（可以设置全部Cookie，不管数量多少），有两个方法：
//
//最少最近使用（least recently used (LRU)）的方法：当 Cookie 已达到限额，自动踢除最老的 Cookie ，以使给最新的 Cookie 一些空间。 Internet Explorer 和 Opera 使用此方法。
//Firefox 很独特：虽然最后的设置的 Cookie 始终保留，但似乎随机决定哪些 Cookie 被保留。似乎没有任何计划（建议：在 Firefox 中不要超过 Cookie 限制）。
//三、不同浏览器间 Cookie 总大小也不同：
//
//Firefox 和 Safari 允许 Cookie 多达 4097 个字节, 包括名（name）、值（value）和等号。
//Opera 允许 Cookie 多达 4096 个字节, 包括：名（name）、值（value）和等号。
//Internet Explorer 允许 Cookie 多达 4095 个字节, 包括：名（name）、值（value）和等号。
//注：多字节字符计算为两个字节。在所有浏览器中，任何 Cookie 大小超过限制都被忽略，且永远不会被设置。
//
//最后让我们看看newland.js是怎么处理cookie的。
//
//newland.js有个重要的对象叫httpflow，其实就是我的操作流flow的子类，它劫持了所有清求与响应。当一个请求过来时，框架就会new一个httpflow去处理它们。它有个patch方法，用于为操作流添加一些有用属性与方法，而不像express.js那样直接在原生对象上改。实现express.js现在的做法有点像Prototype.js，加之node.js的版本现在还没有到1.0，因此API改动还很频繁的。express.js的行为无异走钢线。而把操作移到一个自定义对象就安全多了。

// 源马见https://github.com/RubyLouvre/newland/blob/master/system/mvc.js
 http.createServer(function(req, res) {
            var flow = new Flow()//创建一个流程对象，处理所有异步操作，如视图文件的读取、数据库连接
            flow.patch(req, res)
            services.forEach(function(fn){
                fn(flow);//将拦截器绑到流程对象上
            });
       //...
})
//此外，httpflow还劫持res.writeHead，res.setHeader，目的为实现多次调用setCookie时而不相互覆盖。

// 源马见https://github.com/RubyLouvre/newland/blob/master/system/httpflow.js
 patch: function(req, res){
            this.res =  res;
            this.req =  req;
            this.originalUrl = req.url;
            this.params = {};
            this.session = new Store(this)
            this.flash =  function(type, msg){
                  //。。。。。
            }
            var flow = this;
            var writeHead = res.writeHead;
            var setHeader = res.setHeader;
            flow._setHeader = setHeader;
            res.writeHead = function(){
                flow.fire('header');
                writeHead.apply(this, arguments);
                this.writeHead = writeHead;//还原
            }
            res.setHeader = function(field, val){
                var key = field.toLowerCase()
                if ( 'set-cookie' == key ) {
                    var array = typeof val == "string" ? [val] : val;
                    array.forEach(function(str){
                        var arr =  str.split("=");
                        flow.addCookie(arr[0], arr[1])
                    })
                } else{
                    if ('content-type' == key && this.charset) {
                        val += '; charset=' + this.charset;
                    }
                    setHeader.call(this, field, val);
                }
            }
        }
//此外操作流还有两个有用的方法来添加或移除Cookie。

// 源马见https://github.com/RubyLouvre/newland/blob/master/system/httpflow.js
        addCookie: function(name, val, opt){
            if(!this.resCookies){
                this.resCookies = {};
                this.resCookies[name] = [val, opt]
                this.bind("header", function(){
                    var array = []
                    for(var i in this.resCookies){
                        var arr = this.resCookies[i];
                        array.push( Cookie.stringify(i, arr[0], arr[1] ) )
                    }
                    this._setHeader.call(this.res, "Set-Cookie",array)
                })
            }else{
                this.resCookies[name] = [val, opt]
            }
            return this;
        },
        removeCookie: function(name){
            var cookies = Array.isArray(name) ? name : [ name ];
            cookies.forEach(function(cookie){
                this.addCookie(cookie,"", 0)
            },this);
            return this;
        },
//实质上，经过上面的代码，我们就好方便多次添加或删除Cookie。个人认为用setHeader来操作（即使它已经被偷龙转凤还是不怎么好用），大家还是用addCookie, removeCookie来干吧。这些操作会在用户第一次调用当前的res.whireHead生效！
//
//flow.addCookie("ACookie","xxxxxxxxxx");
//flow.addCookie("BCookie","yyyyyyyyy");
//flow.addCookie('rememberme', 'yes', { expires: 0, httpOnly: true })
// 
////链式写法，同名cookie前者会覆盖后者的，前端只生成“aaa=2; bbb=1”
//flow.addCookie("aaa",1).addCookie("aaa",2).addCookie("bbb",1).addCookie("bbb",1)
// 
//flow.res.setHeader("Set-Cookie","user=aaa")
// 
//flow.removeCookie("oldCookie")
////传入一个字符串数组，同时删除多个cookie
//flow.removeCookie(["myCookie","uuer","newCookie"])
//如果你想查看从客户端来的cookie，那么直接看flow.cookie好了，它会在途中调用一个get_cookie的服务，将原始的字符始形式转换为一个对象。