//plant.js

class Plant{
	constructor(name, owner, preset){
		this.name = name || null;
		this.owner  = owner  || null;
		this.preset = preset || null;
	}

	getName(){
		return this.name;
	}

	getOwner(){
		return this.owner;
	}

	getPreset(){
		return this.preset;
	}
}

module.exports = Plant;
