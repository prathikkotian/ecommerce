/*
Login module
@author: Prathik Kotian
@module: routes/login
*/

var express = require('express');
var mysql = require('mysql')

var router = express.Router();

var connection = require('./connection');
var dbPasswd;
var firstName;

/* Log into the application. */
router.post('/', function(req, res, next) {
var session;
  session = req.session;
  var uname = req.body.username;
  var password = req.body.password;
  
  var sql = 'SELECT password, first_name from users where username=' +mysql.escape(uname);
 
  connection.getConnection(function(err,connection){
	if(err) throw err
	//Query the login table
	connection.query(sql, function (err, rows, fields) {
		if (err) throw err
		if(rows[0] != null){
			dbPasswd = rows[0].password.trim();
			firstName = rows[0].first_name.trim();
		}else{
			dbPasswd = null;
		}
	
		if(password == dbPasswd & uname != null && password != null){
			session.uniqueID = uname;
			session.fname = firstName;
			if(uname == 'jadmin'){
				session.role='admin';
			}else{
				session.role=null;
			}	
			res.json({
				"message":"Welcome " +firstName
			});
		}else{
			res.json({
				"message":"There seems to be an issue with the username/password combination that you entered"
			});
		}
		connection.release();  
	}); 
   });
});

module.exports = router;	
