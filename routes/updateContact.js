var express = require('express');
var router = express.Router();
var isNull = require('is-null-or-empty');
var connection = require('./connection');

/* Update contact info of the user */
router.post('/', function(req, res, next) {
var session;
  session = req.session;
	if(session.uniqueID){
		var fname = req.body.fname;
		var lname = req.body.lname;
		var address = req.body.address;
		var city = req.body.city;
		var state = req.body.state;
		var zip = req.body.zip;
		var email = req.body.email;
		var username = req.body.username;
		var password = req.body.password;
		var column = {};

		if(!isNull(fname))
			column['first_name'] = fname;
		if(!isNull(lname))
			column['last_name'] = lname;
		if(!isNull(address))
			column['address'] = address;
		if(!isNull(city))
			column['city'] = city;				
		if(!isNull(state))
			column['state'] = state;
		if(!isNull(zip))
			column['zip'] = zip;
		if(!isNull(email))
			column['email'] = email;
		if(!isNull(username))
			column['username'] = username;
		if(!isNull(password))
			column['password'] = password;

		var sessionName = session.uniqueID;
		var sql = "update users set ? where username = ?";
		connection.getConnection(function(err, connection){
			if(err) throw err
			connection.query(sql, [column,sessionName], function (err, rows, fields) {
				if (err && err.code == 'ER_DUP_ENTRY') {			
					res.json({
						"message":"The input you provided is not valid"
					});
				}else if(err && err.code != 'ER_DUP_ENTRY'){
					throw err
				}else{
					if(!isNull(fname) && fname != session.fname){
						session.fname = fname;
					}
					res.json({
						"message":session.fname+" your information was successfully updated"
					});	
				}
				connection.release()
			});
		});
	}else{
		res.json({
			"message":"You are not currently logged in"
		});
	}

});

module.exports = router;
