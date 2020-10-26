define('paging', ['/dynamic/components/paging/paging.css'], function (req)
{
	function Paging(id){
		var kit = req('{kit}');
		var dom = `<div class="plugin_paging">
			<div class="have">
				<button id="prev" class="btn">&lt;</button>
				<ul class="page_num">
				</ul>
				<button id="next" class="btn">&gt;</button>
				<input class="page_go" type="number" placeholder="页码" />
				<button id="GO" class="btn">GO</button>
			</div>
			<div class="emprty">暂无数据</div>
		</div>`;
		var paging = kit(dom),
			page_num = paging.find('.page_num'),
			page_go = paging.find('.page_go'),
			have = paging.find('.have'),
			emprty = paging.find('.emprty').hide();
		var curr, max, list, _click;
		(function(){
			var  i, li = '';
			for (i = 1; i < 6; i++) {
				li += `<li>${i}</li>`
			}
			list = page_num.html(li).find('li');
			kit(id).append(paging[0]);
			events();
		}());
		function events(){
			paging.find('#prev').click(function(e){
				if(_click instanceof Function) _click(--curr);
				updata(curr, max);
			});
			paging.find('#next').click(function(e){
				if(_click instanceof Function) _click(++curr);
				updata(curr, max);
			});
			var GO = paging.find('#GO').click(function(e){
				var num = parseInt(page_go.val());
				if(isNaN(num)) return;
				if(_click instanceof Function) _click(num);
				updata(num, max);
			});
			list.click(function(e){
				var num = parseInt(this.innerText);
				if(_click instanceof Function) _click(num);
				updata(num, max);
			});
			page_go.keyup(function(e){
				if(e.keyCode == 13) GO.trigger('click');
			});
		}
		 
		function updata(num, total) {
			max = parseInt(total);
			curr = parseInt(num);
			if(isNaN(curr)) curr = 1;
			if(curr > max) curr = max;
			if(curr < 1) curr = 1;
			
			var min = curr-2, len = curr+2;
			if(len > max) len = max;
			if(min < 1) {
				min = 1;
				if(max > 5) len = max;
			}else if(len-min < 5){
				min = len - 4;
				min = min < 1 ? 1 : min;
			}
			
			list.each(function(el, i){
				var count = i + min;
				if(count > len) {
					el.style.display = 'none';
				} else {
					el.style.display = 'inline-block';
				}
				if(count == curr) {
					el.className = 'currtPage';
				} else {
					el.className = '';
				}
				el.innerText = count;
			});
		}
		
		this.updata = updata;
		this.click = function(fn){
			_click = fn;
		};
		this.show = function(enable){
			if(enable){ //有数据
				have.show();
				emprty.hide();
			} else { //无数据
				have.hide();
				emprty.show();
			}
		};
	}
	
	return id => {
		return new Paging(id);
	}
});
