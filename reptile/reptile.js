// https://github.com/request/request
// https://blog.csdn.net/itkingone/article/details/79259490
/* node环境，cheerio(主要是解析下载的网页可以像jquery一样骚操作，必备，使用也很简单可以上npm上查看文档)。iconv-lite(主要解决下载的资源乱码问题)。正则表达式（如果是接口数据的话有些关键参数是在script中，需要通过正则提取出来）
大概的爬去代码如下

作者：欣然_d10f
链接：https://www.jianshu.com/p/4a3c50178e21
来源：简书
简书著作权归作者所有，任何形式的转载都请联系作者获得授权并注明出处。 
* 
* npm install request
* npm install cheerio
* 
* */

const cheerio = require('cheerio');
const http = require('https');
const iconv = require('iconv-lite'); 

 // 如果是https协议的网站，这里改用https就可以了
 // 请求头最好设置为user-agent，不然有的网站爬不到，做了限制爬虫爬取网页
const options = {
    url: 'https://www.baidu.com/',
    header: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.'
    }
 }
http.get(options, function(res) {
  const chunks = [];
  res.on('data', function(chunk) {
    chunks.push(chunk);
});
res.on('end', function() {
    //查看网页源代码编码方式，设置对应的编码格式
    const html = iconv.decode(Buffer.concat(chunks), 'gb2312');
    //html就是下载到的资源了，
    console.log(html);     
    
    const $ = cheerio.load(html);
    //接下来就是对数据的处理了，jquery怎样操作，你就怎么操作
    
});

/****************************************************************************/

var request = require('request');
var iconv = require('iconv-lite');

module.exports = function(url, method, encoding, callback) {
  request({
    url: url,
    method: method,
    encoding: null,
    // proxy: 'http://127.0.0.1:1087',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
    }
  }, function(err, res, body) {
    body = iconv.decode(body, encoding);
    if (err) {
      console.log(err);
    } else {
      callback(body);
    }
  })
}
var request = require('./request');
var cheerio = require('cheerio');

function fetch() {
  request('https://cnodejs.org/', 'get', 'utf-8', function(body) {
    var $ = cheerio.load(body);
    $('#topic_list').find('.cell').each(function(i, v) {
      var title = $(v).find('.topic_title').text();
      var href = 'https://cnodejs.org' + $(v).find('.topic_title').attr('href');
      console.log(title, href);
    })
  })
}

抓取网站是js渲染的
现在前端这么流行，很多网站都是用js框架写的了，这导致页面都是用js渲染的，普通的http请求拿到的只是html页面，它不会执行js，所以也就没有内容了，下面介绍一下用phantomjs来抓取js渲染的网页内容

这里用网易新闻手机版的，打开链接 https://3g.163.com/touch/news/ 然后查看页面源代码，可以看到body里是没有内容的



安装依赖

yarn add phantom
var phantom = require('phantom');

function news() {
  var sitepage, phInstance;
  phantom.create()
    .then(function (instance) {
      phInstance = instance;
      return instance.createPage();
    }).then(function (page) {
      sitepage = page;
      return page.open('https://3g.163.com/touch/news/');
    }).then(function (status) {
      return sitepage.property('content');
    }).then(function (content) {
      var $ = cheerio.load(content);
      $(".recommend-list>article").each(function (i, v) {
        var title = $(v).find('.title').text();
        var href = $(v).find('a').attr('href');
        console.log(title, href);
      });
    }).then(function() {
      sitepage.close();
      phInstance.exit();
    }).catch(function (err) {
      phInstance.exit();
    })
}