;define('js/lineChart.js', function (require, exports, module){
	'use strict'
	const axes = {
		axis: {x: 0, y:0},
		init(config){
			const obj = {
				canvas: {w: 600, h: 400},
				grid: {size: 30, show: 1, color: '#eee'},
				axis: {color: '#333',label: []},
				dot: {size: 6, color: '#a0daa8'},
				data: []
			}
			var cfg = this.config = Object.assign(obj, config);
			const el = document.createElement('canvas');
			el.width = cfg.canvas.w;
			el.height = cfg.canvas.h;
			this.ctx = el.getContext('2d');
			drawGrid(this.ctx,cfg);
			drawAxis(this.ctx,cfg);
			
			
			
			return this;
		},
		Dots(){
			
		},
		update(arr){
			var wArr = [], hArr = [];
			for (let i = 0; i < arr.length; i++) {
				let obj = arr[i];
				wArr.push(obj.x);
				hArr.push(obj.y);
			}
			var data = {
				wMin: Math.min.apply(null, wArr),
				wMax: Math.max.apply(null, wArr),
				hMin: Math.min.apply(null, hArr),
				hMax: Math.max.apply(null, hArr)
			};
			data.width = data.wMax - data.wMin;
			data.height = data.hMax - data.hMin;
			console.log(data);
		},
		mounted($el){
			if(typeof($el)=="string") $el = document.querySelector($el);
			if($el instanceof Element) $el.appendChild(this.ctx.canvas);
		}
	};
	
	function drawAxis(ctx, cfg){
		var {w, h} = cfg.canvas;
		var {color} = cfg.axis;
		ctx.strokeStyle = color;
		ctx.lineWidth = 1;
		//横轴
		ctx.beginPath();
		ctx.moveTo(50, h - 50);
		ctx.lineTo(w - 50, h - 50);
		ctx.lineTo(w - 50 - 10, h - 50 + 5);
		ctx.lineTo(w - 50 - 10, h - 50 - 5);
		ctx.lineTo(w - 50, h - 50);
		ctx.fill();
		ctx.stroke();
		//竖轴
		ctx.beginPath();
		ctx.moveTo(50, h - 50);
		ctx.lineTo(50, 50);
		ctx.lineTo(50 - 5, 50 + 10);
		ctx.lineTo(50 + 5, 50 + 10);
		ctx.lineTo(50, 50);
		ctx.fill();
		ctx.stroke();
	}
	
	function drawGrid(ctx, cfg){
		var {show, size, color} = cfg.grid;
		if(!show) return;
		var {w, h} = cfg.canvas;
		var len = Math.floor(w/size);
		ctx.strokeStyle = color;
		ctx.lineWidth = 1;
		for (var i = 0; i < len; i++) {
			ctx.beginPath();
			ctx.moveTo(i * size, 0);
			ctx.lineTo(i * size, h);
			ctx.stroke();
		}
		var len = Math.floor(h/size);
		for (var i = 0; i < len; i++) {
			ctx.beginPath();
			ctx.moveTo(0, i * size);
			ctx.lineTo(w, i * size);
			ctx.stroke();
		}
	}
	
	var cfg = {}
	axes.init(cfg).mounted('.box');
	var arr = [];
	for (let i = 0; i < 10; i++) {
		let obj = {}
		obj.x = Math.floor(Math.random() * 100);
		obj.y = Math.floor(Math.random() * 100);
		arr.push(obj);
	}
	axes.update(arr);
	module.exports = axes;
});

