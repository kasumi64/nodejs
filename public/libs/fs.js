const fs = require('fs');

const files = Object.create(null);
module.exports = files;


files.readFile = function(url, option){
	// let file = fs.readFileSync('test/hello.txt', {flag: 'r', encoding: 'utf-8'});
	// console.log(file); // 'binary'
	return new Promise(function(resolve, reject){
		fs.readFile(url, option, (err, data) => {
			// console.log(data);
			if(err) return reject(err);
			resolve(data);
		});
	});
};

files.writeFile = function(url, data){
	return new Promise(function(resolve, reject){
		//w覆盖write，a追加append，r读read
		fs.writeFile(url, data, {flag: 'w', encoding: 'utf-8'}, err => {
			if(err) return reject(err);
			resolve('success');
		});
	});
};

files.fsDel = function(url){
	return new Promise(function(resolve){
		fs.unlink(url, () => {
			console.log(`delete file [${rul}] success.`);
			resolve('success');
		});
	});
};

files.readdir = function(url){
	return new Promise(function(resolve, reject){
		fs.readdir(url, (err, files) => {
			if(err) return reject(err);
			resolve(files);
		});
	});
};

files.rmdir = function(url){
	return new Promise(function(resolve){
		fs.rmdir(url, () => {
			console.log(`remove Dir [${rul}] success.`);
			resolve('success');
		});
	});
};