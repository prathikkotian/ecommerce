var express = require('express');
var router = express.Router();
var isNull = require('is-null-or-empty');
var connection = require('./connection');

/* View registered users */
router.post('/', function(req, res, next) {
var session;
  session = req.session;
	if(session.uniqueID){
		if(session.role == 'admin'){
			var fname = req.body.fname;
			var lname = req.body.lname;
			var sql;
			if(isNull(fname) && isNull(lname)){
				sql = "select first_name, last_name, username from users where username != 'jadmin'";
			}else if(!isNull(fname) && isNull(lname)){	
				sql = "select first_name, last_name, username from users where first_name like '%"+fname+"%' and username != 					'jadmin'";
			}else if(isNull(fname) && !isNull(lname)){
				sql = "select first_name, last_name, username from users where last_name like '%"+lname+"%' and username != 					'jadmin'";
			}else{
				sql = "select first_name, last_name, username from users where first_name like '%"+fname+"%' and last_name like 				'%"+lname+"%' and username != 'jadmin'";
			}
			connection.getConnection(function(err, connection){
				if(err) throw err
				connection.query(sql, function (err, rows, fields) {
					if(err) throw err
					if(rows.length == 0){
						res.json({
							"message":"There are no users that match that criteria"
						});
					}else{
						var jsonStr = '{"message":"The action was successful", "user":[]}';
						var obj = JSON.parse(jsonStr);
						for(var i=0;i<rows.length;i++){
							obj['user'].push({"fname":rows[i].first_name, "lname":rows[i].last_name, 							"userId":rows[i].username});
						}
						jsonStr = JSON.stringify(obj);
						res.json(JSON.parse(jsonStr));
					}
					connection.release();
				});	
			});			
		}else{
			res.json({
				"message":"You must be an admin to perform this action"
			});
		}
	}else{
		res.json({
			"message":"You are not currently logged in"
		});	
	}

});

module.exports = router;
