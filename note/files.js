/*
 1. fs.stat  检测是文件还是目录
 2. fs.mkdir  创建目录
 3. fs.writeFile  创建写入文件
 4. fs.appendFile 追加文件
 5.fs.readFile 读取文件
 6.fs.readdir读取目录
 7.fs.rename 重命名
 8. fs.rmdir  删除目录
 9. fs.unlink删除文件
*/
var fs = require('fs');

//检测是文件还是目录
fs.stat('test', function(err, stats){
    if(err) return console.log(err);
    
    console.log('文件：'+stats.isFile());
    console.log('目录：'+stats.isDirectory());
});
/*
 * 创建目录
 * path     将创建的目录路径
 * mode     目录权限（读写权限），默认0777
 * callback 回调，传递异常参数err
 */
fs.mkdir('css', function(err){
   if(err) return console.log(err);
   console.log('创建目录成功');
});
/**
 * 创建写入文件
 * filename {String}           文件名称
 * data {String | Buffer} 将要写入的内容，可以使字符串 或 buffer数据。
 * options (Object) option数组对象，包含：
 * 		encoding (string) 可选值，默认 ‘utf8′，当data使buffer时，该值应该为 ignored。
 * 		mode (Number) 文件读写权限，默认值 438
 * 		flag (String) 默认值 ‘w'
 * callback {Function}  回调，传递一个异常参数err。
 */
fs.writeFile('t.txt','你好nodejs 覆盖','utf8',function(err){
	if(err) return console.log(err);
    console.log('写入成功');
});

//追加文件
fs.appendFile('t1.txt','这是写入的内容',function(err){
	if(err) return console.log(err);
    console.log('写入成功');
});

//读取文件
fs.readFile('t1.txt', function(err,data){
	if(err) return console.log(err);
    console.log(data.toString());

});

//读取目录  把目录下面的文件和文件夹都获取到。
fs.readdir('html', function(err, data){
	if(err) return console.log(err);
     console.log(data);

});

//重命名 (1.同目录改名  2.不同目录剪切文件);
fs.rename('html/index.html','html/news.html', function(err){
	if(err) return console.log(err);
     console.log('修改名字成功');
});

//删除目录
fs.rmdir('html', function(err){
    if(err) return console.log(err);
    console.log('删除目录成功');
});

//删除文件
fs.unlink('index.txt',function(err){
	if(err) return console.log(err);
    console.log('删除文件成功');
});

//流的方式读取文件
var readStream=fs.createReadStream('input.txt');
var str='';/*保存数据*/
var count=0;  /*次数*/
readStream.on('data',function(chunk){
    str+=chunk;
    count++;
});
//读取完成
readStream.on('end',function(chunk){
    console.log(count);
    console.log(str);

});
//读取失败
readStream.on('error',function(err){
    console.log(err);
});

// 创建一个可以写入的流，写入到文件 output.txt 中
var writerStream = fs.createWriteStream('output.txt');
var data = '我是从数据库获取的数据，我要保存起来11\n';
for(var i=0;i<100;i++){
    writerStream.write(data, 'utf8');
}
//标记写入完成
writerStream.end();
writerStream.on('finish',function(){
    console.log('写入完成');
});
//失败
writerStream.on('error',function(){
    console.log('写入失败');
});

// 创建一个可读流
var readerStream = fs.createReadStream('input.txt');
// 创建一个可写流
var writerStream = fs.createWriteStream('output.txt');
// 管道读写操作
// 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中
readerStream.pipe(writerStream);
console.log("程序执行完毕");
