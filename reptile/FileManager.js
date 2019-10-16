const fs = require("fs");
const path = require('path');
const Formidable = require('formidable');
const Multiparty = require('multiparty');
const iconvLite = require("iconv-lite");
const error = require('../filefx/libs/error.js');


//入口
exports.classify = function(req, res) {
	// formidableUP(req, res);
	
	
	// return
	
	let src = req.url;
	console.log(src)
	if (src.indexOf('/upload/') > -1) {
		if (src.indexOf('/txt') > -1) getBuffer(req, res);
	} else if (src.indexOf('/download/') > -1) {
		if (src.indexOf('/txt') > -1) dwText(bf, res);
	}
};

function getBuffer(req, res){
	var post = '';
	req.on('data', function(chunk) {
		post += chunk;
	});
	req.on('end', function(q) {
		upText(post, req, res)
	});
}

function upText(bf, req, res) {
	// let str = iconvLite.decode(bf, "utf8"); // gb2312 gb18030 ASCII
	// console.log(str)
	// req.setEncoding('binary');
	
	// 边界字符串
	let boundary = req.headers['content-type'].split('; ')[1].replace('boundary=', '');
	// console.log('FileManager', req.headers);


	// let bfStr = JSON.parse( JSON.stringify(bf) );
	let bfStr = bf + '';
	// console.log(boundary);
	// console.log(bfStr);

	let reg = new RegExp(`--${boundary}[\\s]+(Content-Disposition.+?)[\\s]+(Content-Type.+?)\\s{4,4}`);
	let match = bfStr.match(reg);
	if(!match) return;
	let filename = match[1].split('; ')[2].replace(/filename=|"/g, '');
	// console.log(filename);
	// console.log(match[2]);
	bfStr = bfStr.replace(reg, '');
	reg = new RegExp(`\r\n--${boundary}--\\s+`);
	bfStr = bfStr.replace(reg, '');
	
	
	// console.log(Buffer.from(bfStr));
	let ditPath = path.join('./reptile/upload', filename);
	fs.writeFile(ditPath, bfStr, 'utf8', err => {
		if(err) return error.end('-1', res);
		error.end('0', res);
	});
	return true;
}

// 去掉 BOM 头的方法
function BOMStrip(result) {
	if (Buffer.isBuffer(result)) {
		// 如果读取的内容为 Buffer
		if (result[0] === 0xef && result[1] === 0xbb && result[2] === 0xbf) {
			// 若前三个字节是否和 BOM 头的前三字节相同，去掉 BOM 头
			return result.slice(3);
		}
	} else {
		// 如果不是 Buffer
		if (result.charCodeAt(0) === 0xfeff) {
			// 判断第一项是否和 BOM 头的十六进制相同，去掉 BOM 头
			return result.slice(1);
		}
	}
}

function copyBuffer(bf){
	const buf = Buffer.from(bf);
	const json = JSON.stringify(buf);
	
	// 输出: {"type":"Buffer","data":[1,2,3,4,5]}
	const copy = JSON.parse(json, (key, value) => {
		// console.log(key, value);
		return value && value.type === 'Buffer' ?
			Buffer.from(value.data) : value;
	});
	// console.log(copy); // 输出: <Buffer 01 02 03 04 05>
	return copy;
}

function formidableUP(req, res, callback) {
	let dir = "./reptile/upload";
	let formData = {
		encoding: "utf-8",
		uploadDir: dir, //文件上传地址
		keepExtensions: true, //保留后缀
		maxFieldsSize: 2 * 1024 * 1024,
		multiples: true,
		maxFields: 1000,
		hash : false
	};
	let  form = new Formidable.IncomingForm(formData);
	
	form.parse(req, function(err, fields, files) {
		let fl = files.file;
		fs.rename(fl.path, path.join(dir, fl.name), function(err){
			if(err) return error.end('-1', res);
			error.end('0', res);
			// callback(err,obj);
		});
	});
	return true;
}

function multiparty(req, res, callback){
	let dir = "./reptile/upload";
	let formData = {
		encoding: "utf-8",
		uploadDir: dir, //文件上传地址
		keepExtensions: true, //保留后缀
		maxFieldsSize: 2 * 1024 * 1024,
		multiples: true,
		maxFields: 1000,
		hash : false
	};
	let  form = new Multiparty.Form(formData);
	
	form.parse(req, function(err, fields, files) {
		let fl = files.file;
		fs.rename(fl.path, path.join(dir, fl.name), function(err){
			if(err) return error.end('-1', res);
			error.end('0', res);
			// callback(err,obj);
		});
	});
	return true;
}

function readBytes(){
	const read = fs.createReadStream('./download/1.txt')
	read.setEncoding('utf-8')
	read.resume();//让文件流开始'流'动起来
	read.on('data',data =>{//监听读取的数据，如果打印data就是文件的内容
	    console.log('正在读');
	});
	read.on('end', () => { //监听状态
	    console.log('文件读取结束');
	});
	return read;
}

function writeBytes(bf){
	const stream = fs.createWriteStream('./reptile/upload/1.png');
	stream.write(bf);
	stream.on('finish',() => { //finish - 所有数据已被写入到底层系统时触发。
		console.log('写入完成');
	});
	stream.end();
	// readerStream.pipe(writerStream);
}


function dwText(bf, res) {
	fs.readFile('./reptile/upload/1.txt', "utf-8", (err,data) => {
		error.end('0', res);
	});
}
