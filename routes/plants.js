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

//Register
router.post('/add-plant', function(req, res){
  var name = req.body.plantName;
	var preset = req.body.plantPreset.charAt(0);
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
      res.redirect('../index');
    }
  });
});

module.exports = router;
