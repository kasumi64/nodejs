var path = require('path');

var prefix = '/dynamic/page/', home ='/dynamic/page/index.html',
router = {
	'/': home, '/index': home, '/index.html': home,
	'/login': '/dynamic/page/login.html',
	'/search': '/dynamic/page/search.html'
};
exports.path = function(src){
	var href = router[src];
	if(!href){
		var type = path.extname(src);
		if(!type) href = '/404.html';
	}
	return href || src;
};
