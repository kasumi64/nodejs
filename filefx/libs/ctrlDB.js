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
	
	function getType(obj){
		let tostr = Object.prototype.toString;
		let tp = tostr.call(obj).toLocaleLowerCase();
		return tp.replace(/\[object |]/g, '');
	}
	
	function isOriginObj(obj){
		return (getType(obj)=='object'&&obj.constructor.name=='Object') ? true : false;
	}
	
	/**
	 * @param {Object} origin
	 * $gt -------- greater than  >
		$gte --------- gt equal  >=
		$lt -------- less than  <
		$lte --------- lt equal  <=
		$ne ----------- not equal  !=
		$eq  --------  equal  =
	 */
	function condition(origin){
		let k, o;
		for (k in origin) {
			o = origin[k];
			if(getType(o)=="object")
				origin[k] = sign(o);
		}
		return origin;
	}
	function sign(val){
		let sign = {
			'>': '$gt', '>=': '$gte', '=': '$eq', 
			'<': '$lt', '<=': '$lte', '!=': '$ne'
		}
		let s, k, obj = {};
		for (k in val) {
			s = k.replace(/(>)|(>=)|(=)|(<)|(<=)|(!=)/g, w => {
				return sign[w] || w;
			});
			obj[s] = val[k];
		}
		return obj;
	}
	
	this.find = function (args, options={}){ // query为字段，options为过虑条件
		return new Promise((resolve, reject) => {
			let fields = options.projection;
			if(fields){ //fields == projection
				fields._id = fields._id || 0;
			} else options.projection = {_id:0, lastModified: 0, createTimestamp: 0, cmdID: 0};//过滤_id, 0为不显自己, 1为只显示自己
			let query = condition(args);
			_table.find(query, options).toArray((err, result) => {
				if(err) reject(err, result);
				else resolve(result);
			});
		});
	}
	
	this.getList = async function(query, data, fields){
		let size = Math.floor(data.size||10), page = Math.floor(data.page||1),
			count = --page * size, total;
		if(size < 1) size = 10;
		if(page < 0) page = 0;
		
		total = await _table.countDocuments(query); //countDocuments estimatedDocumentCount
		
		let options = {
			collation: {locale:'zh', numericOrdering:true},
			sort: {createTimestamp: -1},
			skip: count, limit: size, //skip分页跳过的条数，limit读取条数
			projection: {createTimestamp: 0} //过滤
		};
		if(fields) options.projection = fields;
		return this.find(query, options).then(result => {
			let obj = {
				lists: result, total,
				currtPage: ++page,
				totalPage: Math.ceil(total/size),
				lastPage: result.length==0 ? true : (count+result.length==total)
			}
			return obj;
		});
	};
	
	this.findOne = function (query, options={}){
		let fields = options.projection;
		if(fields){ //fields == projection
			fields._id = fields._id || 0;
		} else options.projection = {_id:0, lastModified: 0, createTimestamp: 0, cmdID: 0};
			
		return _table.findOne(query, options);
	};
	
	function testTime(es) {
		return new Promise(function(resolve){
			setTimeout(()=>{
				console.log('testTimeout');
				resolve(es);
			}, 2000);
		});
	}
	
	this.insertOne = function(data, options){
		console.log('添加一条数据！');
		return _table.insertOne(data, options);
	};
	
	this.updateOne = function(filter, data){
		console.log('修改数据！');
		return _table.updateOne(filter, {
			$set: data, 
			$currentDate: {lastModified: true} 
		}, {upsert: false, multi: false}); //multi=True：是否对查询到的全部数据进行操作，upsert=True：如果找不到是否插入一新条数据
	};
	
	this.deleteOne = function(filter, options){
		console.log('删除一条数据！');
		return _table.deleteOne(filter, options);
	};
	
	this.remove = function(filter, options){
		console.log('删除多条数据！');
		return _table.deleteMany(filter, options);
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
