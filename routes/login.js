var express = require('express');
var mysql = require('mysql')

//DB Connection Properties
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'admin',
  database : 'calculator'
});
var router = express.Router();
var session;
var dbPasswd;
var firstName;

/* Log into the application. */
router.post('/', function(req, res, next) {
  session = req.session;
  if(session.uniqueID){
	req.session.destroy();
  }
  var uname = req.body.username;
  var password = req.body.password;
  
  var sql = 'SELECT password, first_name from login where username=' +mysql.escape(uname);
  
  //Query the login table
  connection.query(sql, function (err, rows, fields) {
	if (err) throw err
	if(rows[0] != null){
		dbPasswd = rows[0].password;
		firstName = rows[0].first_name;
	}else{
		dbPasswd = null;
	}
	
	if(password == dbPasswd){
		session.uniqueID = uname;
		res.json({
			"message":"Welcome " +firstName
		});
	}else{
		res.json({
			"message":"There seems to be an issue with the username/password combination that you entered"
		});
	}
})
  

});

module.exports = router;
