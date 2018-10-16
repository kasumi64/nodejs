initModule([],function(req, exports, module)
{
	var doc = document, win = window, utils = req('utils');
	var userBox, paging;
	
	function init(){
		paging= req('paging')('.paging');
		paging.click(function(page){
			search(page);
		});
	}
	function events(){
		kit('#search').click(function(e){
			search(1);
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
		userBox = kit('.userBox').click(function(e){
			if(e.target===this) userBox.hide();
		});
		userBox.find('#updata').click(function(e){
//			alert()
		});
		userBox.find('#canle').click(function(e){
			userBox.hide();
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
	function search(pageNum){
		var params = {
			cmd: '10001',
			id: userid.val(),
			page: pageNum || 1,
			size: 7,
		};
		ajax(params, function(data){
			if(data.code != 0) return alert(data.errinfo);
			var list = data.list;
			var str = kit.template(data.list, dom);
			var btn = table.html(str).find('.fz button').click(function(e){
				
				if(this.className == 'del'){
					var params = {id: this.name, cmd: '10004'};
					ajax(params, function(data){
						search();
					});
				}else if(this.className == 'updata'){
					userBox.show();
				}
				
			});
			paging.updata(pageNum, data.totalPage);
			paging.show(data.total > 0);
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
