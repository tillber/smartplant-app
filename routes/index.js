//index.js
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var DBHandler = require("../models/dbhandler");
var utf8 = require('utf8');
var handlebars = require('express-handlebars');

//Local storage
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
}

router.post('/configure-plant', function(req, res){
  var plantId = req.body.plantId;
  getPlant(plantId, function(error, plant){
      if(error){
        console.log(error);
      }else{
        getDefaultPresets(function(presets){
          if(error){
            console.log(error);
          }else{
            console.log("Fetched default presets");
            for(var i = 0; i < presets.length; i++){
              if(presets[i].PRESET_ID == plant[0].PRESET_ID){
                presets.splice(i, 1);
                preset = {defaultPreset: true, presetId: plant[0].PRESET_ID, presetName: plant[0].PRESET_NAME};
              }
            }

            defaultPresets = {defaultPresets: presets};

            getCustomPresets(function(presets){
              if(error){
                console.log(error);
              }
              if(presets != null){
                console.log("Fetched custom presets");

                for(var i = 0; i < presets.length; i++){
                  if(presets[i].PRESET_ID == plant[0].PRESET_ID){
                    presets.splice(i, 1);
                    preset = {customPreset: true, presetId: plant[0].PRESET_ID, presetName: plant[0].PRESET_NAME};
                  }
                }

                customPresets = {customPresets: presets};
              }else{
                console.log("No custom presets")
                customPresets = {noCustomPresets: "No custom presets"};
              }

              console.log(customPresets);
              console.log(defaultPresets);
              console.log(preset);

              res.render('configurePlant', Object.assign({plantId: plant[0].PLANT_ID, plantName: plant[0].PLANT_NAME}, defaultPresets, customPresets, preset));
            });
          }
        });
      }
  });
});

router.get('/bookmark', function(req, res){
  res.render('index', {bookmarked: true});
});

router.get('/', function(req, res){
  verifyToken(res, function(error, user){
    getDefaultPresets(function(defaultPresets){
      getCustomPresets(function(customPresets){
        if(customPresets == null){
          customPresets = {noCustomPresets: "No custom presets"};
        }else{
          customPresets = {customPresets: customPresets};
        }
        getPlants(function(error, plants){
          if(error){
            console.log(error);
          }
          if(plants != null){
            console.log("Fetched plants");
            plants = {plants: plants};
          }else{
            plants = {noPlants: "No plants added"}
          }

          try{
            res.render('index', Object.assign({token: true, name: user, defaultPresets: defaultPresets}, customPresets, plants));
          }catch(error){
            console.log(error);
          }
        });
      });
    });
  });
});

function getCustomPresets(callback){
  var dbhandler = new DBHandler();
  var localStorage = new LocalStorage('./scratch');

  dbhandler.RetrieveCustomPresets(localStorage.getItem('user'), function(error, presets){
    if(error){
      console.log(error);
    }else{
      if(presets != null){
        //Presets exists
        callback(presets)
      }else{
        //Could not fetch default preset
        callback(null);
      }
    }
  });

}

function getPlant(id, callback){
  var dbhandler = new DBHandler();
  dbhandler.RetrievePlant(id, function(error, plant){
    if(error){
      console.log(error);
    }else{
      if(plant != null){
        callback(null, plant);
      }else{
        //Could not fetch plant
        callback("Could not fetch plant", null);
      }
    }
  });
}

function getPresetName(id, callback){
  var dbhandler = new DBHandler();
  dbhandler.RetrievePresetById(id, function(error, presetName){
    if(error){
      console.log(error);
    }else{
      if(presetName != null){
        callback(null, presetName);
      }else{
        //Could not fetch preset name
        callback("Could not fetch preset name", null);
      }
    }
  });
}

function getDefaultPresets(callback){
  var dbhandler = new DBHandler();
  dbhandler.RetrieveDefaultPresets(function(error, presets){
    if(error){
      console.log(error);
    }else{
      if(presets != null){
        //Presets exists
        callback(presets);
      }else{
        //Could not fetch default presets
        callback(null);
      }
    }
  });
}

function getPlants(callback){
  var dbhandler = new DBHandler();
  var localStorage = new LocalStorage('./scratch');
  dbhandler.RetrievePlants(localStorage.getItem('user'), function(error, plants){
    if(error){
      console.log(error);
    }else{
      if(plants != null){
        callback(null, plants);
      }else{
        callback("No plants", null);
      }
    }
  });
}

//Verify token
function verifyToken(res, callback){
  var localStorage = new LocalStorage('./scratch');
	const token = localStorage.getItem('token');
	if(token !== null){
		jwt.verify(token, 'secretkey', function(error, decoded) {
			if(error) {
				//Malformed token
				res.redirect('users/login');
			}else{
        callback(null, decoded.firstname);
			}
		});
	}else{
		//Forbidden
		res.redirect('users/login');
	}
}

module.exports = router;
