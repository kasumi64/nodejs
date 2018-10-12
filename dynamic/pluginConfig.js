/*
 * @author: kasumi;
 * @date: 20181011--20181011;
 */

(function(){
	var config = {};
	config.paths = {
		libs:	'./dynamic/libs',
	};
	config.alias = {
		'utils':	'libs/utils.js',
		'axios':	'libs/axios.min.js',
	};
	config.vars = {
		kit: 'main/kit'
	};
	initModule.config(config);
	var kit = kitRequire('{kit}');
	var a=kit('script[src]');
	console.log(a)
}());

