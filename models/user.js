//user.js

class User{
	constructor(id, firstName, lastName, email, password){
		this.id = id || null;
		this.firstName = firstName || null;
		this.lastName  = lastName  || null;
		this.email = email || null;
		this.password  = password  || null;
	}

	getId(){
		return this.id;
	}

	getFirstName(){
		return this.firstName;
	}

	getLastName(){
		return this.lastName;
	}

	getEmail(){
		return this.email;
	}

	getPassword(){
		return this.password;
	}

	equals(email, password){
		if(this.getEmail() === email && this.getPassword() === password){
			return true;
		} else{
			return false;
		}
	}
}

module.exports = User;
