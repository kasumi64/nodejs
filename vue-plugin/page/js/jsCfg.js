/**
 * 依赖配置
 */
;(!function(require, exports, module) {
	var cfg = {
		// 路径配置
		paths: {
			// libs:	'@/libs',
		},
		// 别名配置
		alias: {
			initTag:	'css/initTag.min.css',
		},
		// 变量配置
		vars: {
			'zhcn':	'locale'
		},
		// 预加载项
		preload: ['initTag'],
		debug: false
	};
	$module.config(cfg);
	
	return 'config';
}());

!function(){
	var mobile = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i;
	if (navigator.userAgent.match(mobile)) {
		console.log('移动端');
	}else{
		console.log('PC端');
	}
	// var html = document.documentElement;
	
}();
