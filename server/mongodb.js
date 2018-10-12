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
		} else options.fields = {_id:0};
		return _table.find(query, options);
	}
		
	this.list = async function(query, data, res, success, fail){
		let size = data.size||10, page = data.page||1,
			count = await _table.countDocuments(query);
		page = --page * size;
		let options = {
			collation: {locale:'zh', numericOrdering:true},
			sort: {timeStamp: -1},
			skip: page, limit: size,
			fields: {timeStamp: 0}
		};
		find(query, options).toArray(function(err, result){
			if(err) return fail(-102, res, err);
			
			var obj = {
				list: result, total: count,
				totalPage: Math.ceil(count/size),
				lastPage: page*size+result.length==count
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
	this.updata = function(data, res, success, fail){
		var id = {id: data.id}
		_table.updata(id, {$set: data}, function(err, result){
			if(err) {
				return fail(-103, res, err);
			}
			if(success instanceof Function) success(res);
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
