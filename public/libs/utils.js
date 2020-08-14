const {resolve, join} = require('path');

module.exports = {
	resolve, join,
	root: resolve(__dirname, '../../'),
	random(min, max){ //随机数
		if(max < min){
			let num = min;
			min = max;max = num;
		}
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	verifyCode(len = 4){ //验证码
		var code = '';
		for (let i = 0; i < len; i++) {
			code += this.random(0, 9);
		}
		return code;
	}
};
