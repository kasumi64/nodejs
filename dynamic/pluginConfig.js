/*
 * @author: kasumi;
 * @date: 20181011--20181011;
 */

(function(){
	var config = {};
	config.paths = {
		libs:	 './dynamic/libs',
		plugins: './dynamic/components'
	};
	config.alias = {
		'utils':	'libs/utils.js',
		'axios':	'libs/axios.min.js',
		'moment':	'libs/moment.js',
		'paging':	'plugins/paging/paging.js',
	};
	config.vars = {
		kit: 'main/kit'
	};
	initModule.config(config);
}());

