define('utils', function (require, exports, module)
{
	var axios = require('axios');
	//解析html
	function analyzeHtml(html, view){
		var app = doc.getElementById('app');
		var data = html.replace(/(<!--[\s\S]+?-->)|(\/\*[\s\S]+?\*\/)|(\/\/.+)/g,'');
		var fr = doc.createDocumentFragment(), code=[],count=0;
		data = data.replace(/<script[\s\S]+?script>/igm, function(str){
			var src = (/<script.+?src=['"]{0,1}(.+?\.js)/igm).exec(str);
			if(src){
				var es = doc.createElement('script');
				es.src = src[1];
				es.onload = es.onerror = finish;
				fr.appendChild(es);
			} else {
				src = (/<scrip[\s\S]+?>([\s\S]+)<\/script>/igm).exec(str);
				if(src) code.push(src[1]);
			}
			return '';
		});

		app.innerHTML = data;
		var max = fr.children.length;
		app.appendChild(fr);
		
		function finish(){
			if(++count!=max) return;
			try{
				for (var i = 0; i < code.length; i++) eval(code[i]);
			}catch(e){console.log(e);}
		}
	}
	return {};
});
