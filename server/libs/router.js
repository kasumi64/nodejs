var path = require('path');

var prefix = '/dynamic/', home ='/dynamic/index.html',
router = {
	'/': home, '/index': home, '/index.html': home,
	'/login': '/dynamic/login.html',
};
exports.path = function(src){
	var href = router[src];
	if(!href){
		var type = path.extname(src);
		if(!type) href = '/404.html';
	}
	return href || src;
};
