//简单爬虫20190117
var superagent = require('superagent');
var cheerio = require('cheerio');
var error = require('./libs/error.js');
var iconv = require('iconv-lite');
var http  = require('http');


var exp = {};
exports.search = function(get, res) {
	if (get.type == 'baidu') searchBaidu(get, res);
	else if (get.type == 'google') searchGoogle(get, res);
	else if (get.type == 'CNode') crawlerCNodejs(get, res);
};

function searchBaidu(get, res) {
	let words = encodeURIComponent(get.words);
	// let  words = encodeURIComponent('AVC');
	// console.log(words);
	let url = `http://www.baidu.com/s?wd=${words}&pn=0`;

	superagent.get(url).end(function(err, sres) {
		// console.log(sres.text)
		// 常规的错误处理
		if (err) {
			return error.end('100', res, err);
		}

		var $ = cheerio.load(sres.text);
		var items = [];
		$('#content_left .c-container').each(function(idx, el) {
			let $el = $(el);
			let title = $el.find('h3 a');
			let obj = {
				title: title.html(),
				href: title.attr('href'),
				src: $el.find('img').attr('src'),
				txt: $el.find('.c-abstract').html() || $el.find('.c-row').html()
			};
			items.push(obj);
		});
		var obj = error.getMsg('0');
		obj.lists = items;
		// obj.txt = $.html();
		// console.log(obj.txt);
		/* let a = Object.assign({}, superagent);
		for (let k in superagent) {
			console.log(k)
		} */
		res.end(JSON.stringify(obj));
	});
}

function searchGoogle(get, res) {
	// getUrl(res)
	// return
	let  words = encodeURIComponent(get.words);
	let url = `https://www.google.co.kr/search?q=${words}&oq=${words}&hl=zh-CN&start=0`;

	superagent.get(url).end(function(err, sres) {
		if (err) {
			return error.end('100', res, err);
		}
		
		sres.setEncoding('utf-8');
		var $ = cheerio.load(sres.text);
		var items = [];
		var w = get.words.replace(/[\]\[\)\}\(\{]/ig,'');
		$('#main .ZINbbc').each(function(idx, el) {
			let $el = $(el);
			let title = $el.find('.jfp3ef .vvjwJb').html();
			if(!title) return 1;
			let obj = {
				title,
				href: $el.find('.jfp3ef a').attr('href'),
				src: '',
				txt: $el.find('.jfp3ef .s3v9rd').text(),
			};
			obj.txt = obj.txt.replace(new RegExp(w, 'ig'), `<em>${w}</em>`);
			// obj.txt = iconv.decode(new Buffer(obj.txt), 'gb2312');
			items.push(obj);
		});
		var obj = error.getMsg('0');
		obj.lists = items;
		// obj.txt = $.html();
		// console.log(obj.txt);
		res.end(JSON.stringify(obj));
	});
}

function crawlerCNodejs(get, res) {
	// 用 superagent 去抓取 https://cnodejs.org/ 的内容
	superagent.get('https://cnodejs.org/').end(function(err, sres) {
		// 常规的错误处理
		if (err) {
			return error.end('100', res, err);
		}
		// sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
		// 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
		// 剩下就都是 jquery 的内容了
		var $ = cheerio.load(sres.text);
		var items = [];
		$('#topic_list .topic_title').each(function(idx, element) {
			var $element = $(element);
			items.push({
				title: $element.attr('title'),
				href: 'https://cnodejs.org' + $element.attr('href')
			});
			// return false
		});
		// setTimeout(()=>{ res.end(); },5000);
		var obj = error.getMsg('0');
		obj.lists = items;
		// console.log(obj);
		res.end(JSON.stringify(obj));
		// return obj
	});
}

function getUrl(response) {
	
	http.get('http://nodejs.cn/', (res) => {
		const {
			statusCode
		} = res;
		const contentType = res.headers['content-type'];

		let error;
		if (statusCode !== 200) {
			error = new Error('请求失败\n' +
				`状态码: ${statusCode}`);
		} else if (!/^application\/json/.test(contentType)) {
			error = new Error('无效的 content-type.\n' +
				`期望的是 application/json 但接收到的是 ${contentType}`);
		}
		if (error) {
			console.error(error.message);
			// 消费响应数据来释放内存。
			res.resume();
			// return;
		}

		res.setEncoding('utf8');
		let rawData = '';
		res.on('data', (chunk) => {
			rawData += chunk;
		});
		res.on('end', () => {
			try {
				const parsedData = JSON.parse(rawData);
				response.end(parsedData)
				console.log(parsedData);
			} catch (e) {
				response.end(rawData)
				console.error(e.message);
			}
		});
	}).on('error', (e) => {
		console.error(`出现错误: ${e.message}`);
	});
}
