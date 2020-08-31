const path = require('path');
const moduleAlias = require('module-alias'); //别名设置


// console.log(resolve());
function resolve(src = ''){
	return path.resolve(src)
}

moduleAlias.addAliases({
	'$_': resolve('public'),
	'$_kit': resolve('public/libs/nodeKit.js')
});

const package = {
	"repository": {
		"type": "git",
		"url": "http://baidu.com"
	},
}

module.exports = {
	addAliases(obj = {}){
		for (let k in obj) {
			obj[k] = resolve(obj[k]);
		}
		moduleAlias.addAliases(obj);
	}
};

// moduleAlias.addAlias('@client', __dirname + '/src/client')

/* moduleAlias.addAlias('@src', (fromPath, request, alias) => {
	// fromPath - Full path of the file from which `require` was called
	// request - The path (first argument) that was passed into `require`
	// alias - The same alias that was passed as first argument to `addAlias` (`@src` in this case)

	// Return any custom target path for the `@src` alias depending on arguments
	if (fromPath.startsWith(__dirname + '/others')) return __dirname + '/others'
	return __dirname + '/src'
}) */
 

// Register custom modules directory
// moduleAlias.addPath(__dirname + '/node_modules_custom')
// moduleAlias.addPath(__dirname + '/src')
 

// Import settings from a specific package.json
// moduleAlias(__dirname + '/package.json')
 
// Or let module-alias to figure where your package.json is
// located. By default it will look in the same directory
// where you have your node_modules (application's root)
// moduleAlias()