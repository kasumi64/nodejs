const http2 = require('http2');


function isValidPath(requrest, response){
	requrest.src = decodeURIComponent(requrest.url);
	requrest.method = requrest.method.toLowerCase();
	let {src, method} = requrest;
	
	if(src =='/favicon.ico' || method == 'options') {
		// response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
		response.writeHead(200, {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With,yourHeaderFeild',
			'Content-Type': 'text/html;charset=utf-8'
		});
		response.end('<h1 style="text-align: center">options</h1>');
		return false;
	}
	return true;
}

function err(e) {
	if (e.code === 'EADDRINUSE') {
		// console.warn('\x1b[91m', `端口: ${e.port} 被占用`);
		this.server.removeAllListeners('request');
		this.port++;
		this.run();
	}
}

function enter(requrest, response) {
	// console.log(requrest.url);
	
	if(!isValidPath(requrest, response)) return;
	
	this.project(requrest, response);
	// response.stream.respondWithFD(file, headers);
}

class Server {
	constructor(project, port = 443){
		this.project = project;
		this.port = port;
		this.enter = enter.bind(this);
		this.server = http2.createSecureServer({
			cert: fs.readFileSync(path.join(__dirname, '../ssl/cert.pem')),
			key: fs.readFileSync(path.join(__dirname, '../ssl/key.pem'))
		});
	}
	
	run(fn){
		if(fn instanceof Function) this.project = fn;
		this.server.on('request', this.enter).listen(this.port, () => {
			console.log(`Server running at http://127.0.0.1:${this.port}/`);
			console.log(`Server running at http://localhost:${this.port}/`);
		}).once('error', err.bind(this));
	}
	
}

module.exports = {
	run(project, port = 80){
		const serve  = new Server(project, port);
		serve.run();
	},
}

//https://http2.akamai.com/demo/h2_demo_frame.html
//https://http1.akamai.com/demo/h1_demo_frame.html