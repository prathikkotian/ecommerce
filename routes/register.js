var express = require('express');
var router = express.Router();
var isNull = require('is-null-or-empty');
var connection = require('./connection');
		
/* Registering a new user */
router.post('/', function(req, res, next) {
var session;
	var fname = req.body.fname;
	var lname = req.body.lname;
	var address = req.body.address;
	var city = req.body.city;
	var state = req.body.state;
	var zip = req.body.zip;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;	
	if(isNull(fname) || isNull(lname) || isNull(address) || isNull(city) 
		|| isNull(state) || isNull(zip) || isNull(email) || isNull(username) || isNull(password)){
		res.json({
			"message":"The input you provided is not valid"
		});		
	}else{
		city = city.replace(/[\u0800-\uFFFF]/g, '');
		state = state.replace(/[\u0800-\uFFFF]/g, '');
		var record = [fname, lname, address, city, state, zip, email, username, password];
		var sql = "insert into users (first_name, last_name, address, city, state, zip, email, username, password) values (?)";
		connection.getConnection(function(err, connection){
			if(err) throw err
			connection.query(sql, [record], function (err, rows, fields) {
				if (err && err.code == 'ER_DUP_ENTRY') {			
					res.json({
						"message":"The input you provided is not valid"
					});
				}else if(err && err.code != 'ER_DUP_ENTRY'){
					throw err
				}else{
					res.json({
						"message":fname+" was registered successfully"
					});	
				}
				connection.release();
			});
		});
	}

});

module.exports = router;
