/*require the ibm_db module*/
var ibmdb = require('ibm_db');
var bcrypt = require('bcrypt');
var User = require("../models/user");
var Preset = require("../models/preset");

console.log("Test program to access DB2 sample database");

class DBHandler {
	constructor () {}

	RetrieveUser(username, callback){
		ibmdb.open("DRIVER={DB2};DATABASE=BLUDB;UID=lvd92627;PWD=b0btn5bq^919cfmt;HOSTNAME=dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net;port=50000", function(err, conn)
		{
			if(err) {
				console.log("retrieveuser error: ", err.message);
			} else{
				conn.query("SELECT id, firstname, username, password FROM userinformation WHERE username='" + username + "'",
				function(err, users, moreResultSets) {
					if(err) {
						console.log("retrieveuser error: ", err.message);
					} else{
						if(users.length == 0){ //User doesn't exist
							console.log("returning null");
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

	RetrieveDefaultPresets(callback){
		ibmdb.open("DRIVER={DB2};DATABASE=BLUDB;UID=lvd92627;PWD=b0btn5bq^919cfmt;HOSTNAME=dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net;port=50000", function(err, conn)
		{
			if(err) {
				console.log("retrievedefaultpresets error: ", err.message);
			} else{
				conn.query("SELECT PRESET_ID, PRESET_NAME FROM PRESET WHERE PRESET_CREATOR='5'",
				function(err, presets, moreResultSets) {
					if(err) {
						console.log("retrievedefaultpresets error: ", err.message);
					} else{
						if(presets.length == 0){ //User doesn't exist
							//console.log("returning null");
							callback(null, null);
						} else{ //User exist
							callback(null, presets);
						}
					}

					conn.close(function(){
						console.log("Connection Closed");
					});
				});
			}
		});
	}

	RetrieveCustomPresets(user, callback){
		ibmdb.open("DRIVER={DB2};DATABASE=BLUDB;UID=lvd92627;PWD=b0btn5bq^919cfmt;HOSTNAME=dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net;port=50000", function(err, conn)
		{
			if(err) {
				console.log("retrievecustompresets error: ", err.message);
			} else{
				conn.query("SELECT PRESET_ID, PRESET_NAME FROM PRESET WHERE PRESET_CREATOR='" + user + "'",
				function(err, presets, moreResultSets) {
					if(err) {
						console.log("retrievecusotmpresets error: ", err.message);
					} else{
						if(presets.length == 0){ //User doesn't exist
							//console.log("returning null");
							callback(null, null);
						} else{ //User exist
							callback(null, presets);
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
				console.log("error: ", err.message);
			} else{
				conn.query("SELECT * FROM userinformation",
				function(err, users, moreResultSets) {
					if(err) {
						console.log("error: ", err.message);
					} else{
						if(users.length == 0){ //User doesn't exist
							console.log("returning null");
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
				console.log("retrieveuserbyid error: ", err.message);
			} else{
				conn.query("SELECT id, firstname, username, password FROM userinformation WHERE id='" + id + "'",
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

	AddPreset(preset_name, preset_creator, mintemp, maxtemp, minph, maxph, minhumidity, maxhumidity, callback){

		ibmdb.open("DRIVER={DB2};DATABASE=BLUDB;UID=lvd92627;PWD=b0btn5bq^919cfmt;HOSTNAME=dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net;port=50000", function(err, conn)
		{
			if(err) {
				console.error("error: ", err.message);
			} else{

				conn.prepare("INSERT INTO PRESET (preset_name, preset_creator, mintemp, maxtemp, minph, maxph, minhumidity, maxhumidity) VALUES (?,?,?,?,?,?,?,?)", function(err, stmt) {
			    if (err) {
			     	//could not prepare for some reason
			    	console.log(err);
			     	return conn.closeSync();
			   	}

	   			//Bind and Execute the statment asynchronously
	       	stmt.execute([preset_name, preset_creator, mintemp, maxtemp, minph, maxph, minhumidity, maxhumidity], function (err, result) {
		        if(err) callback(err);
		        else{
							console.log("added preset");
							result.closeSync();
							callback(null);
						}

		        //Close the connection
		        conn.close(function(){
							console.log("Connection Closed");
						});
	        });
        });
			}
		});
	}

	RetrievePresetById(id, callback){
		ibmdb.open("DRIVER={DB2};DATABASE=BLUDB;UID=lvd92627;PWD=b0btn5bq^919cfmt;HOSTNAME=dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net;port=50000", function(err, conn)
		{
			if(err) {
				console.log("retrieveuserbyid error: ", err.message);
			} else{
				conn.query("SELECT preset_name FROM preset WHERE preset_id='" + id + "'",
				function(err, preset, moreResultSets) {
					if(err) {
						callback(err, null);
					} else{
						if(preset.length == 0){ //User doesn't exist
							//console.log("returning null");
							callback(null, null);
						} else{ //User exist
							callback(null, preset[0]);
						}
					}

					conn.close(function(){});
				});
			}
		});
	}

	RetrievePlants(owner, callback){
		ibmdb.open("DRIVER={DB2};DATABASE=BLUDB;UID=lvd92627;PWD=b0btn5bq^919cfmt;HOSTNAME=dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net;port=50000", function(err, conn)
		{
			if(err) {
				console.error("retrieveplants error: ", err.message);
			} else{
				conn.query("SELECT * FROM userplant INNER JOIN preset ON userplant.plant_preset=preset.preset_id WHERE userplant.plant_owner='" + owner + "'",
				function(err, plants, moreResultSets) {
					if(err) {
						callback(err, null);
					} else{
						if(plants.length == 0){ //User doesn't exist
							//console.log("returning null");
							callback(null, null);
						} else{ //User exist
							callback(null, plants);
						}
					}

					conn.close(function(){
						console.log("Connection Closed");
					});
				});
			}
		});
	}

	RetrievePlant(plant, callback){
		ibmdb.open("DRIVER={DB2};DATABASE=BLUDB;UID=lvd92627;PWD=b0btn5bq^919cfmt;HOSTNAME=dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net;port=50000", function(err, conn)
		{
			if(err) {
				console.error("retrieveplant error: ", err.message);
			} else{
				conn.query("SELECT * FROM userplant INNER JOIN preset ON userplant.plant_preset=preset.preset_id WHERE plant_id='" + plant + "'",
				function(err, plant, moreResultSets) {
					if(err) {
						callback(err, null);
					} else{
						if(plant.length == 0){ //Plant doesn't exist
							//console.log("returning null");
							callback(null, null);
						} else{ //User exist
							callback(null, plant);
						}
					}

					conn.close(function(){
						console.log("Connection Closed");
					});
				});
			}
		});
	}

	AddPlant(name, preset, user, callback){
		ibmdb.open("DRIVER={DB2};DATABASE=BLUDB;UID=lvd92627;PWD=b0btn5bq^919cfmt;HOSTNAME=dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net;port=50000", function(err, conn)
		{
			if(err) {
				console.error("addplant error: ", err.message);
			} else{
				conn.prepare("INSERT INTO USERPLANT (plant_name, plant_owner, plant_preset) VALUES (?,?,?)", function(err, stmt) {
			     if (err) {
			     //could not prepare for some reason
			     console.log(err);
			     return conn.closeSync();
			   }

			   //Bind and Execute the statment asynchronously
	       stmt.execute([name, user, preset], function (err, result) {
	         if(err) {
						 console.log(err);
						 callback(err);
					 }
	         else {
						 result.closeSync();
						 callback(null);
					 }

	         //Close the connection
	         conn.close(function(err){});
	            });
	        });
			}
		});
	}

	EditPlant(plant_id, new_name, new_preset, callback){
	  ibmdb.open("DRIVER={DB2};DATABASE=BLUDB;UID=lvd92627;PWD=b0btn5bq^919cfmt;HOSTNAME=dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net;port=50000", function(err, conn)
	  {
	      if(err) {
	          console.error("editplant error: ", err.message);
	      } else{
	          conn.prepare("UPDATE USERPLANT SET plant_name=?, plant_preset=? WHERE plant_id=?", function(err, stmt) {
	           if (err) {
	           //could not prepare for some reason
	           console.log(err);
	           return conn.closeSync();
	         }

	         //Bind and Execute the statment asynchronously
	     	stmt.execute([new_name, new_preset, plant_id], function (err, result) {
	       if(err) {
             console.log(err);
             callback(err);
         }
	       else {
             result.closeSync();
             callback(null);
         }

	       //Close the connection
	       conn.close(function(err){});
	          });
	      });
	      }
	  });
  }

	DeletePlant(plant_id, callback){
        ibmdb.open("DRIVER={DB2};DATABASE=BLUDB;UID=lvd92627;PWD=b0btn5bq^919cfmt;HOSTNAME=dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net;port=50000", function(err, conn)
        {
            if(err) {
                console.error("deleteplant error: ", err.message);
            } else{
                conn.prepare("DELETE FROM USERPLANT WHERE plant_id=?", function(err, stmt) {
                 if (err) {
                 //could not prepare for some reason
                 console.log(err);
                 return conn.closeSync();
               }

               //Bind and Execute the statment asynchronously
           stmt.execute([plant_id], function (err, result) {
             if(err) {
                         console.log(err);
                         callback(err);
                     }
             else {
                         result.closeSync();
                         callback(null);
                     }

             //Close the connection
             conn.close(function(err){});
                });
            });
            }
        });
    }

}

module.exports = DBHandler;
