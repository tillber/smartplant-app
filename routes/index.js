//index.js
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var DBHandler = require("../models/dbhandler");

//Local storage
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

router.get('/', verifyToken, function(req, res){

});

//Verify token
function verifyToken(req, res, next){
	const token = localStorage.getItem('token');
	if(token !== null){
		jwt.verify(token, 'secretkey', function(error, decoded) {
			if(error) {
				//Malformed token
				res.render('login', {token: false});
			}else{
        var dbhandler = new DBHandler();
        dbhandler.RetrieveCustomPresets(localStorage.getItem('user'), function(error, presets){
          if(error){
            console.log(error);
          }else{
            if(presets != null){
              var customPresets = presets;
              dbhandler.RetrieveDefaultPresets(function(error, presets){
                if(error){
                  console.log(error);
                }else{
                  if(presets != null){
                    var defaultPresets = presets;
                    res.render('index', {token: true, name: decoded.firstname, defaultPresets: defaultPresets, customPresets: customPresets});
                  }
                }
              });
            }
          }
        });
			}
		});
	}else{
		//Forbidden
		res.render('login', {token: false});
	}
}

module.exports = router;
