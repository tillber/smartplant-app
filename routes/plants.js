//plants.js
var express = require('express');
var router = express.Router();
var DBHandler = require("../models/dbhandler");
var Preset = require("../models/preset");
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

router.get('/', function(req, res){});

//Configure plant
router.post('/configure-plant-db', function(req, res){
  if(req.body.submit == "delete"){
    var plant = req.body.plantId;
    deletePlant(plant, function(error){
      if(error) console.log(error);
      else{
        console.log("deleted plant");
        res.redirect('../');
      }
    });
  } else if(req.body.submit == "cancel"){
      res.redirect('../');
  } else {
    var id = req.body.plantId;
    var name = req.body.plantName;
    var preset = req.body.plantPreset;

    editPlant(id, name, preset, function(error){
        if(error) console.log(error);
        else{
          console.log("updated plant");
          res.redirect('../');
        }
    });
  }
});

//Add plant
router.post('/add-plant', function(req, res){
  var name = req.body.plantName;
	var preset = req.body.plantPreset.split(" ")[0];
  var desc = req.body.plantDescription;
  var owner = localStorage.getItem('user');

  console.log(name + " " + preset + " " + desc + " " + owner);

  var dbhandler = new DBHandler();
  dbhandler.AddPlant(name, preset, owner, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("added plant");
      res.redirect('../index');
    }
  })
});

//Delete plant
router.post('/delete-plant', function(req, res){

});

//Add preset
router.post('/add-preset', function(req, res){
  var name = req.body.presetName;
	var minTemp = req.body.presetTempMin;
  var maxTemp = req.body.presetTempMax;
  var minPH = req.body.presetpHMin;
  var maxPH = req.body.presetpHMax;
  var minMoist = req.body.presetMoistMin;
  var maxMoist = req.body.presetMoistMax;
  var creator = localStorage.getItem('user');
  console.log("name: " + name +  ", creator: " +  creator + ", minTemp: " +  minTemp + ", maxtemp: " +  maxTemp + ", minPh: " +  minPH + ", maxPh: " +  maxPH + ", minMoist: " +  minMoist + ", maxMoist: " + maxMoist);

  var dbhandler = new DBHandler();
  dbhandler.AddPreset(name, creator, minTemp, maxTemp, minPH, maxPH, minMoist, maxMoist, function (err){
    if(err){
      console.log(err);
    }else{
      res.render('../index');
    }
  });
});

function deletePlant(plant, callback){
  var dbhandler = new DBHandler();
  dbhandler.DeletePlant(plant, function(error){
    if(error){
      callback(error);
    }else{
      callback(null);
    }
  })
}

function editPlant(id, name, preset, callback){
  var dbhandler = new DBHandler();
  dbhandler.EditPlant(id, name, preset, function(error){
    if(error){
      callback(error);
    }else{
      callback(null);
    }
  });
}

module.exports = router;
