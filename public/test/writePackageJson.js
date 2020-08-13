const files = require('../libs/fs.js');
const readline = require('readline');

const rl = readline.createInterface({
	output: process.stdout,
	input: process.stdin
});

function asks(label){
	return new Promise((resolve, reject) => {
		rl.question(label, (answer) => {
			resolve(answer);
		});
	});
}

rl.on('close', () => {
	process.exit(0);
});

async function start(){
	let name = await asks('包名是什么？');
	let description = await asks('描述是什么？');
	let author = await asks('作者名称是什么？');
	
	let str = `{
		"name": "${name}",
		"version": "1.0.0",
		"description": "${description}",
		"main": "index.js",
		"scripts": {
			"dev": "node"
		},
		"dependencies": {},
		"devDependencies": {},
		"keywords": [],
		"author": "${author}",
		"license": "ISC",
		"private": true
	}`
	
	console.log(str);
	rl.close();
}

start();