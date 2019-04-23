//plants.js
var express = require('express');
var router = express.Router();
var DBHandler = require("../models/dbhandler");
var User = require("../models/user");
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

//Register
router.post('/add-plant', function(req, res){
  var name = req.body.plantName;
	var preset = req.body.plantPreset;
  var owner = localStorage.getItem('user');
});
