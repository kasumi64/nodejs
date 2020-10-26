define('editUser', ['/dynamic/components/editUser/editUser.css'], function (req, exp)
{
	var kit = req('{kit}'), utils = req('utils'),
		userBox, inputs, isAdd, sex, recall;
	
	(function init(){
		userBox = kit('.userBox');
		inputs = userBox.find('input[type=text]');
		sex = userBox.find('input[type=radio]');
		events();
	}());
	
	function events(){
		userBox.click(function(e){
			if(e.target===this) userBox.hide();
		});
		userBox.find('#updata').click(function(e){
			var val = inputs.val(true);
			if(val[0]=='') return utils.weakTips('请输入用户ID');
			var param = {
				cmd: isAdd ? '10002' : '10003',
				id: val[0],
				name: val[1],
				age: val[2],
				sex: getSex()
			};
			utils.post(param, function(data){
				userBox.hide();
				utils.weakTips(data.errinfo);
				if(recall instanceof Function) recall();
			});
		});
		userBox.find('#canle').click(function(e){
			userBox.hide();
		});
	};
	
	exp.hide = function(){
		userBox.hide();
	};
	exp.add = function(){
		isAdd = true;
		inputs[0].disabled = false;
		userBox.show();
	};
	exp.updata = function(param, fn){
		isAdd = false;
		inputs[0].disabled = true;
		inputs[0].value = param.id;
		inputs[1].value = param.name || '';
		inputs[2].value = param.age || '';
		chooseSex(param.sex);
		recall = fn;
		userBox.show();
	};
	function chooseSex(str){
		switch (str){
			case '男': str=0; break;
			case '女': str=1; break;
			default: str=2; break;
		}
		sex[str].checked = true;
	}
	function getSex(){
		var ind;
		sex.each(function(el, i){
			if(el.checked){
				ind = i;
				return false
			}
		});
		switch (ind){
			case 0: return '男';
			case 1: return '女';
			default: return '保密';
		}
	}
});
