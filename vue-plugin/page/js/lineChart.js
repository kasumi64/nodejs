!function (){
	'use strict'
	var axes = {
		axis: {x: 0, y:0},
		init(config){
			const obj = {
				canvas: {w: 600, h: 400},
				dot: {size: 6, color: '#a0daa8'}
			}
			var cfg = this.config = Object.assign(obj, config);
			const el = document.createElement('canvas');
			el.width = cfg.canvas.w;
			el.height = cfg.canvas.h;
			this.ctx = el.getContext('2d');
			
			
			
			
			
			return this;
		},
		Dots(){
			
		},
		mounted($el){
			if(typeof($el)=="string") $el = document.querySelector($el);
			if($el instanceof Element) $el.appendChild(this.ctx.canvas);
		}
	};
	
	var cfg = {}
	axes.init(cfg).mounted('.box');
}();

