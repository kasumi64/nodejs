initModule(['jquery3','http'],function(req, exports, module)
{
	var doc = document, win = window, utils = req('utils')
	
	function init(){
		
	}
	function events(){
		kit('#search').click(function(e){
			search();
		});
		
		kit('#add').click(function(e){
			var id = '';
			for (var i = 0; i < 6; i++) {
				id += kit.randomNum(0, 9);
			}
			var params = {
				cmd: '10002',
				id: id,
				name: getName(),
				age: kit.randomNum(18, 50),
				sex: kit.randomNum(1, 2)==1 ? '男' : '女',
			};
			ajax(params, function(data){
				console.log(data);
				search();
			});
		});
		
		kit('#remove').click(function(e){
			var params = {
				cmd: '10005'
			};
			ajax(params, function(data){
				table.html('');
			});
		});
		
	};
	function getName(){
		var str = '', arr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
		for (var i=0; i<6; i++) {
			str +=  arr[kit.randomNum(0, 51)];
		}
		return str;
	}
	var dom = kit('#dom').html(), userid = kit('.search'), table = kit('.table');
	function search(page){
		var params = {
			cmd: '10001',
			id: userid.val(),
			page: page || 1,
			size: 7,
		};
		ajax(params, function(data){
			if(data.code  != 0) return alert(data.errinfo);
			var list = data.list;
			var str = kit.template(data.list, dom);
			var btn = table.html(str).find('.fz button').click(function(e){
				var params = {id: this.name};
				if(this.className == 'del'){
					params.cmd = '10004';
				}else if(this.className == 'updata'){
					params.cmd = '10003';
				}
				ajax(params, function(data){
					search();
				});
			});
		});
	}
	
	function ajax(params, cb){
		var _res, isTxt;
		var options = {
			method: "POST",
			headers: {
				"Content-Type": "text/plain;charset=utf-8",
				"Accept": "application/json, text/plain, */*",
			},
			body: JSON.stringify(params)
		};
		
		fetch('http://127.0.0.1:8080/json', options).then(response=>{
			_res = response;
//			console.log(_res)
			isTxt = false;
			return response.clone().json();
		}).then(data=>{
			if(cb instanceof Function) cb(data);
		}).catch(function(e){
			isTxt = true;
			return _res.text();
		}).then(function(data){
			if((cb instanceof Function)&&isTxt) cb(data);
		});
	}
	
	return {init:init, events:events};
});
