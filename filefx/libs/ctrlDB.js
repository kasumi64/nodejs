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
	/**
	 * db.person.find( { age: { $mod: [ 2, 0 ] } } )
	 * $mod会将查询的值除以第一个给定的值，若余数等于第二个给定的值，则返回该结果。
	 * $not与正则表达式联合使用时极为有效，用来查找那些与特定模式不匹配的文档。
	 * $in  { field: { $in: [<value1>, <value2>, ... <valueN> ] } }
	 * 		匹配数组中的任一值
	 * $nin  db.tianyc02.find({age:{$nin:[11,22]}})
	 * 		不匹配数组中的值
	 * $or  查询age<20或者address是beijing的文档：
	 *		db.person.find( { $or: [ { age: { $lt: 20 } }, { address: "beijing" } ] } )
	 * $and
	 * @param {Object} val
	 */
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
		let size = Math.floor(data.pageSize||20), page, count, total;
		page = Math.floor(data.currentPage||1);
		if(size < 1) size = 20;
		if(page < 1) page = 1;
		count = --page * size;
		
		total = await _table.countDocuments(condition(query)); //countDocuments estimatedDocumentCount
		
		let options = {
			collation: {locale:'zh', numericOrdering:true},
			sort: {createTimestamp: -1},
			skip: count, limit: size, //skip分页跳过的条数，limit读取条数
			projection: {createTimestamp: 0}, //过滤
			timeout: true,
			maxTimeMS: 5 * 1000
		};
		if(fields) options.projection = fields;
		
		return this.find(query, options).then(result => {
			let obj = {
				lists: result, totalSize: total,
				currentPage: ++page,
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
		if(!options) {
			options = {
				$currentDate: {lastModified: true}
			};
		}
		return _table.insertOne(data, options);
	};
	
	this.insertMany = function(data, options){
		console.log('添加多条数据！');
		if(!options) {
			options = {
				ordered: false,
				$currentDate: {lastModified: true}
			};
		}
		return _table.insertMany(data, options);
	};
	
	this.updateOne = function(filter, update, option){
		console.log('修改数据！');
		 // upsert=True：如果找不到是否插入一新条数据，multi=True：是否对查询到的全部数据进行操作
		let options = Object.assign({upsert: false, multi: false}, option||{});
		return _table.updateOne(filter, {
			$set: update, 
			$currentDate: {lastModified: true} 
		}, options);
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
