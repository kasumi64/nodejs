/* 
（1）openssl genrsa -out server.key 1024 //生成服务器私钥

（2）openssl rsa -in server.key -pubout -out server.pem  // 生成公钥

  //自己扮演CA机构，给自己服务器颁发证书，CA机构也需要自己私钥，CSR文件(证书签名请求文件)，和证书

 (3)  openssl genrsa -out ca.key 1024            //生成CA 私钥
      openssl req -new -key ca.key -out ca.csr   //生成CA CSR文件
      openssl x509 -req -in ca.csr -signkey ca.key  -out ca.crt  //生成CA 证书

 //生成证书签名请求文件
 (4) openssl req -new -key server.key -out server.csr //生成server CSR文件
  
 //向自己的机构请求生成证书
 (5) openssl x509 -req -CA  ca.crt -CAkey ca.key -CAcreateserial -in server.csr   -out server.crt   //生成server 证书
 */
const https = require('https');
const fs = require('fs');



const server = https.createServer({
	key: fs.readFileSync('ssl/key.pem'),
	cert: fs.readFileSync('ssl/cert.pem')
});
server.on('error', (err) => console.error(err));

server.on('request', (requrest, response) => {
	console.log(requrest.url);
	response.writeHead(200);
	response.end('hello world\n');
});

server.listen(8443);

console.log('https://localhost:8443/');
