MongoDb
mongod --dbpath D:\mongodb ,//起动
mongo 127.0.0.1:27017 //连接远程
use 库名
show dbs
show collections
db.dropDatabase();
db.表名.insert({"id":"AA"});
db.表名.drop()

find(query, options).toArray(function(err, result){});
find(query, options).forEach(function(err, result){});

db.表名.find();全部 db.user.find({"age":20});等于
db.表名.find({"age":{$gt:20}});大于  db.表名.find({"age":{$lt:20}});小于
db.表名.find({"age":{$gte:20}});大于等于  db.表名.find({"age":{$lte:20}});小于等于
db.user.find({"id":1230,"age":20});多个条件, 等于
db.user.find({"age":{$gte:20,$lte:30}});多个条件,大于等于20,小于等于30
db.user.find({"title":/文字/});模糊查询 db.user.find({"title":/^zh/});以zh开头的；

db.user.find({}, {age: true}); 只查一列，某个字段
db.user.find({}, {age:1, name:1}); 查多列，某些字段
db.user.find({"age":{$gt:20}, {id:1});只查列，age大于20,的全部id

db.user.find().sort({"age":1}); 排序，1为正序，-1为倒序
db.user.find().limit(5); 前五条
db.userInfo.find().skip(5).limit(10);可用于分页，limit 是 pageSize，skip 是第几页*pageSize
db.userInfo.find({age: 22, age: 25}); 并且
db.userInfo.find({$or: [{age: 22}, {age: 25}]}); 或
db.userInfo.findOne();查询第一条数据

db.userInfo.find({age: {$gte: 25}}).count();统计数量,如果要返回限制之后的记录数量，,
	要使用 count(true)或者 count(非 0)db.users.find().skip(10).limit(5).count(true);
db.userInfo.find({"state":{$type:'string'}}); 或$type=2,查找列里的某个类型

db.user.update({name:'AAA'}, {$set:{age:30}});注意:不出现$set 关键字,完整替换
db.user.remove({age: 132});删除数据
db.user.remove( { "borough": "Queens" }, { justOne: true } );删除一条数据

1 。添加一个字段.  url 代表表名 , 添加字段 content。 字符串类型。
db.url.update({}, {$set: {content:""}, $currentDate: {lastModified:true, "time": {$type: "timestamp"} }, {multi: 1})。
2  删除一个字段
db.url.update({},{$unset:{'content':''}},false, true)

//索引
db.userInfo.find().explain("executionStats");sql的执行时间
db.user.ensureIndex({"username":1});创建索引,数字 1 表示索引按升序存储，-1 表示索引按照降序方式存储
db.user.ensureIndex({"username":1, "age":-1});复合索引
db.user.getIndexes();查看索引
db.user.dropIndex({name:1});删除索引
db.user.ensureIndex({"userid":1},{"unique":true});唯一索引
















