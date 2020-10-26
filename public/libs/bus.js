class Bus { //observe

	constructor (target){
		Reflect.defineProperty(this, '_dictionary', {
			value: new Map(),
			enumerable: false
		});
		Reflect.defineProperty(this, '_onceDict', {
			value: new Map(),
			enumerable: false
		});
		Reflect.defineProperty(this, 'target', {
			value: target,
			enumerable: false
		});
	}

	_bingo(master, fn, dict){
		if(!(fn instanceof Function)) return false;
		if(!dict.has(master)) dict.set(master, new Set);
		if(dict.get(master).has(fn)) return console.warn(`type: ${master}./ Function is already registered.`);
		return true;
	}

	on (master, fn){
		if(!this._bingo(master, fn, this._dictionary)) return this;
		this._dictionary.get(master).add(fn);
		return this;
	}

	emit (master, ...args){
		// console.log(master, args);
		const that = this.target;
		if(this._dictionary.has(master)){
			this._dictionary.get(master).forEach(fn => {
				fn.apply(that, args);
			});
		}
		if(this._onceDict.has(master)){
			this._onceDict.get(master).forEach(fn => {
				fn.apply(that, args);
			});
			this._onceDict.delete(master);
		}
		return this;
	}

	once (master, fn){
		if(!this._bingo(master, fn, this._onceDict)) return this;
		this._onceDict.get(master).add(fn);
		return this;
	}

	clear (master, fn){
		if(fn instanceof Function){
			if(this._dictionary.has(master)) {
				this._dictionary.get(master).delete(fn);
			}
			if(this._onceDict.has(master)) {
				this._onceDict.get(master).delete(fn);
			}
		} else if (master) {
			this._dictionary.delete(master);
			this._onceDict.delete(master);
		} else {
			this._dictionary.clear();
			this._onceDict.clear();
		}
		return this;
	}
	
}

module.exports = {
	instances: self => return new Bus(self),
	bus: new Bus()
};
