# http2-test


### 开发环境

 - mac: 10.12.6
 - node: v13.9.0
 - //生成一个名为“ssl.key”的 RSA key文件：执行结果:生成ssl.pass.key 和 ssl.key
 - openssl genrsa -des3 -passout pass:private -out ssl.pass.key 2048
 - openssl rsa -passin pass:private -in ssl.pass.key -out ssl.key
 - //删除中间文件
 - rm ssl.pass.key
 - 接着，利用已经生成的 ssl.key 文件，进一步生成 ssl.csr 文件：
 - openssl req -new -key ssl.key -out ssl.csr
 - 执行此行命令会提示输入密码，按回车即可，因为前面我们在生成 ssl.key 时选择了密码留空。
 - 最后我们利用前面生成的 ssl.key 和 ssl.csr 文件来生成 ssl.crt 文件，也就是自签名的 SSL 证书文件：
 - openssl x509 -req -days 3652 -in ssl.csr -signkey ssl.key -out ssl.crt
 - 这一步之后，我们得到一个自签名的 SSL 证书文件 ssl.crt，有效期为 365 天。此时，ssl.csr 文件也已经不再被需要，可以删除掉了：
 - rm ssl.csr
 
 ### 安装
 
 ```npm
npm install nodemon -g
npm install
```

### 启动

1、输入命令
```npm
npm run serve
```

2、在浏览器打开： https://localhost:80/