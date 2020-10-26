const http2 = require('http2');
const fs = require('fs');



const server = http2.createSecureServer({
	key: fs.readFileSync('ssl/kasumi.top.key'),
	cert: fs.readFileSync('ssl/ssl.crt')
});
server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
	// 流是一个双工流。
	stream.respond({
		'content-type': 'text/html; charset=utf-8',
		':status': 200
	});
	stream.end('<h1>你好世界</h1>');
});

server.listen(8443);

console.log('https://localhost:8443/');
