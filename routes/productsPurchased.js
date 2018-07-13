var express = require('express');
var router = express.Router();
var isNull = require('is-null-or-empty');
var connection = require('./connection');

/* view products purchased */
router.post('/', function(req, res, next) {
	var session;
	session = req.session;
	if(session.uniqueID){
		if(session.role == 'admin'){
			var username = req.body.username;
			var sql;
			connection.getConnection(function(err, connection){
				if(err) throw err
				sql = "select a.product_name, count(b.asin) as quantity from products a, purchase b where b.asin = a.asin and 						b.username = ? group by a.product_name, b.asin";
				connection.query(sql, username, function (err, rows, fields) {
					if(err) throw err
					
					if(rows.length == 0){
						res.json({
							"message":"There are no users that match that criteria"	
						});
					}else{
						var jsonStr = '{"message":"The action was successful","products":[]}';
						var obj = JSON.parse(jsonStr);
						for(var i=0;i<rows.length;i++){
							obj['products'].push({"productName":rows[i].product_name,"quantity":rows[i].quantity});
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
