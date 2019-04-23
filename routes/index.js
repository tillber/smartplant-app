//index.js
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

//Local storage
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

router.get('/', verifyToken, (req, res) => {
});

//Get startpage
router.get('/index', verifyToken, function(req, res){
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
				res.render('index', {token: true, name: decoded.firstname});
			}
		});
	}else{
		//Forbidden
		res.render('login', {token: false});
	}
}

module.exports = router;
