var mongoClient = require('mongodb').MongoClient;
var dbUrl = 'mongodb://127.0.0.1:27017/';


function MongoDb(dbName, tableName){
	var _this = this, _client, _db, _table;
	
	this.open = function(dbName, table){
		mongoClient.connect(dbUrl, {useNewUrlParser: true}, function(err, client){
			if(err) {
				console.log(err);
				return
			}
			_client = client;
			_db = client.db(dbName);
			_this.table(table);
		});
	};
	this.table = function(collection){ _table = _db.collection(collection);return this; };
	this.close = function(){ _client.close();return this; };
	
	function find(query, options={}){
		if(options.fields){
			options.fields._id = 0;
			options.fields.lastModified_ = 0;
		} else options.fields = {_id:0, lastModified: 0};//过滤_id, 0为不显自己, 1为只显示自己
		return _table.find(query, options);
	}
		
	this.list = async function(query, data, res, success, fail){
		let size = Math.floor(data.size||10), page = Math.floor(data.page||1),
			total = await _table.countDocuments(query),
			count = --page * size;
		if(size < 1) size = 10;
		if(page < 0) page = 0;
		
		let options = {
			collation: {locale:'zh', numericOrdering:true},
			sort: {timeStamp: -1},
			skip: count, limit: size, //skip分页跳过的条数，limit读取条数
			fields: {timeStamp_: 0} //过滤
		};
		find(query, options).toArray(function(err, result){
			if(err) return fail(-102, res, err);
			
			let obj = {
				list: result, total,
				currtPage: ++page,
				totalPage: Math.ceil(total/size),
				lastPage: result.length==0 ? true : (count+result.length==total)
			}
			if(success instanceof Function) success(res, obj);
		});
	};
	this.insert = function(data, res, success, fail){
		console.log('添加数据:', data);
		_table.insertOne(data, function(err, result){
			if(err) {
				return fail(-101, res, err);
			}
			if(success instanceof Function) success(res);
		});
	};
	this.updateOne = function(data, res, success, fail){
		var id = {id: data.id}
		delete data.id;
		_table.updateOne(id, {
			$set: data, 
			$currentDate: {lastModified: true} 
		}, {upsert: false, multi: false}, //multi=True：是否对查询到的全部数据进行操作，upsert=True：如果找不到是否插入一新条数据
		function(err, result){
			if(err) {
				return fail(-103, res, err);
			}
			if(success instanceof Function) success(res);
			console.log('更新成功！',data);
		});
	};
	this.deleteOne = function(data, res, success, fail){
		_table.deleteOne({id: data.id}, function(err, result){
			if(err) {
				return fail(-104, res, err);
			}
			if(success instanceof Function) success(res);
			console.log('删除成功！'+data.id);
		});
	};
	this.remove = function(data, res, success, fail){
		_table.remove({}, function(err, result){
			if(err) {
				return fail(-105, res, err);
			}
			if(success instanceof Function) success(res);
			console.log('删除多条成功！');
		});
	};
	
	function noRepeat(){
		_table.aggregate([{
			$group: {
				_id: {age: '$age'}, 
				count: {$sum: 1},
				dups: {$addToSet: '$_id'}
			}
		}, {
			$match: {
				count: {$gt: 1}
			}
		}]).forEach(function(doc) {
			doc.dups.shift();
			_table.remove({ _id: {$in: doc.dups} });
		});
	}
	
	(function(){
		_this.open(dbName, tableName);
	}());
}
module.exports = {
	open: function(dbName, tableName){return new MongoDb(dbName, tableName);},
};
