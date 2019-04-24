/*require the ibm_db module*/
var ibmdb = require('ibm_db');
var bcrypt = require('bcrypt-nodejs');
var User = require("../models/user");

console.log("Test program to access DB2 sample database");

class DBHandler {
	constructor () {}

	RetrieveUser(username, callback){
		ibmdb.open("DRIVER={DB2};DATABASE=BLUDB;UID=lvd92627;PWD=b0btn5bq^919cfmt;HOSTNAME=dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net;port=50000", function(err, conn)
		{
			if(err) {
				console.error("error: ", err.message);
			} else{
				conn.query("SELECT firstname, username, password FROM userinformation WHERE username='" + username + "'",
				function(err, users, moreResultSets) {
					if(err) {
						console.error("error: ", err.message);
					} else{
						if(users.length == 0){ //User doesn't exist
							//console.log("returning null");
							callback(null, null);
						} else{ //User exist
							callback(null, new User(users[0].ID, users[0].FIRSTNAME, users[0].LASTNAME, users[0].USERNAME, users[0].PASSWORD));
						}
					}

					conn.close(function(){
						console.log("Connection Closed");
					});
				});
			}
		});
	}

	RetrieveUsers(callback){
		ibmdb.open("DRIVER={DB2};DATABASE=BLUDB;UID=lvd92627;PWD=b0btn5bq^919cfmt;HOSTNAME=dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net;port=50000", function(err, conn)
		{
			if(err) {
				console.error("error: ", err.message);
			} else{
				conn.query("SELECT * FROM userinformation",
				function(err, users, moreResultSets) {
					if(err) {
						console.error("error: ", err.message);
					} else{
						if(users.length == 0){ //User doesn't exist
							//console.log("returning null");
							callback(null, null);
						} else{ //User exist
							callback(null, users);
						}
					}

					conn.close(function(){
						console.log("Connection Closed");
					});
				});
			}
		});
	}

	RetrieveUserById(id, callback){
		ibmdb.open("DRIVER={DB2};DATABASE=BLUDB;UID=lvd92627;PWD=b0btn5bq^919cfmt;HOSTNAME=dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net;port=50000", function(err, conn)
		{
			if(err) {
				console.error("error: ", err.message);
			} else{
				conn.query("SELECT firstname, username, password FROM userinformation WHERE id='" + id + "'",
				function(err, users, moreResultSets) {
					if(err) {
						callback(err, null);
					} else{
						if(users.length == 0){ //User doesn't exist
							//console.log("returning null");
							callback(null, null);
						} else{ //User exist
							callback(null, new User(users[0].ID, users[0].FIRSTNAME, users[0].LASTNAME, users[0].USERNAME, users[0].PASSWORD));
						}
					}

					conn.close(function(){
						console.log("Connection Closed");
					});
				});
			}
		});
	}

	RegisterUser(username, password, firstName, lastName, callback){
		ibmdb.open("DRIVER={DB2};DATABASE=BLUDB;UID=lvd92627;PWD=b0btn5bq^919cfmt;HOSTNAME=dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net;port=50000", function(err, conn)
		{
			if(err) {
				console.error("error: ", err.message);
			} else{
				bcrypt.hash(password, 10, function(err, hash) {
					conn.query("INSERT INTO userinformation (username, password, firstname, lastname) VALUES ('" + username + "', '" + hash + "', '" + firstName + "', '" + lastName + "')",
					function(err, users, moreResultSets) {
						if(err) {
							callback(err)
						}else{
							callback(null);
						}

						conn.close(function(){
							 console.log("Connection Closed");
						});
					});
				});
			}
		});
	}

	AddPlant(name, preset, user){
		ibmdb.open("DRIVER={DB2};DATABASE=BLUDB;UID=lvd92627;PWD=b0btn5bq^919cfmt;HOSTNAME=dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net;port=50000", function(err, conn)
		{
			if(err) {
				console.error("error: ", err.message);
			} else{
				conn.query("INSERT INTO  (username, password, firstname, lastname) VALUES ('" + username + "', '" + hash + "', '" + firstName + "', '" + lastName + "')",
				function(err, users, moreResultSets) {
					if(err) {
						callback(err)
					}else{
						callback(null);
					}

					conn.close(function(){
						 console.log("Connection Closed");
					});
				});
			}
		});
	}
}

module.exports = DBHandler;
