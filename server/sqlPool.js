var mysql = require('mysql');
//var mysql = require('mysql');
function OptPool(dbName, tableName){
	var table = tableName;
	this.flag = true;
	this.pool = mysql.createPool({
	    host     : '127.0.0.1',
	    user     : 'root',
	    password : '',
	    database : dbName,
	    port:'3306'
	});
	
	this.getPool = function(){
		if(this.flag){
			this.pool.on('connection', function(connection){
//				connection.query('set session auto_increment');
				this.flag = false;
				
				console.log('connection')
				
				pool.getConnection(function(err, conn){
					conn.query('select * from users', function(err, res){
						console.log(res);
						conn.release(); //放回连接池
					});
				});
				
				
				
				
			});
		}
		return this.pool;
	}
}
var pool = new OptPool('abc','users');
pool = pool.getPool();


function Dase(dbName, tableName){
	//连接数据库
	var mysql=require('mysql'), table = tableName, usr;
	
	var connection = mysql.createConnection({
	    host     : '127.0.0.1',
	    user     : 'root',
	    password : '',
	    database : dbName,
	    port:'3306'
	});
	
	connection.connect(function(e){
		if(e){
			console.log('connectError:');
			console.log(e);
		}
	});
	this.setTable = function(name){
		table = name;
	};
	this.autoNum = function(num, fn){
		connection.query('alter table '+table+' auto_increment = 1', function(err, rows, fields) {
			if(fn instanceof Function) fn(err, rows, fields);
		});
	};
	
	//插入一个user
//	usr={name:'zhangsan',password:'pwdzhangsan',mail:'zhangsan@gmail.com'};
	this.insert = function(args, fn){
		connection.query('insert into '+table+' set ?', args, function(err, result) {
		    if (err) throw err;
//			console.log(result,'\n');
			
			if(fn instanceof Function) fn(err, result);
		});
	}
	this.select = function(){
		var sql = 'select * from '+table;
		if(where) sql += where;
		connection.query(sql, function(err, rows, fields) {
		    if (err) throw err;
		    console.log('selected after inserted:','\n');
		    console.log(rows, '\n');
		    
		    if(fn instanceof Function) fn(err, rows, fields);
		});
	};
//	connection.query('select * from users', function(err, rows, fields) {
//	    if (err) throw err;
//	
//	    console.log('selected after inserted');
//	    for(var i= 0,usr;usr=rows[i++];){
//	        console.log('user nae='+usr.name + ', password='+usr.password);
//	    }
//	    console.log('\n');
//	});
	//更新user，带条件
	this.update = function(){
		connection.query('update users set password="ddd" where name="zhangsan"', {password:'ppp'}, function(err, result) {
		    if (err) throw err;
		
		    console.log('updated zhangsan\'s password to ddd');
		    console.log(result);
		    console.log('\n');
		});
	};
	
	
	
//	connection.query('update users set password="ddd" where name="zhangsan"', {password:'ppp'}, function(err, result) {
//	    if (err) throw err;
//	
//	    console.log('updated zhangsan\'s password to ddd');
//	    console.log(result);
//	    console.log('\n');
//	});
	
	
	//删除一个user，带条件
	connection.query('delete from  users where name="zhangsan"', {password:'ppp'}, function(err, result) {
	    if (err) throw err;
	
	    console.log('deleted zhangsan');
	    console.log(result);
	    console.log('\n');
	});
	
	//查询user，所有
	connection.query('select * from users', function(err, rows, fields) {
	    if (err) throw err;
	
	    console.log('selected after deleted');
	    for(var i= 0,usr;usr=rows[i++];){
	        console.log('user nae='+usr.name + ', password='+usr.password);
	    }
	
	    console.log('\n');
	});
	//关闭数据库连接
	connection.end();
}


//var sql = new Dase('abc', 'users');
//var usr={name:'maliu',password:'pwdmaliu',mail:'maliu@163.com'};
//sql.insert(usr);


