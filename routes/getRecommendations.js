var express = require('express');
var router = express.Router();
var isNull = require('is-null-or-empty');
var connection = require('./connection');

/*Get recommendations */
router.post('/', function(req, res, next) {
	var session;
	session = req.session;
	if(session.uniqueID){		
		var asin = req.body.asin;		
		var sql;
		
		connection.getConnection(function(err, connection){
			if(err) throw err
			sql = "select linked_asin,count(linked_asin) as count from recommendations where asin=? group by linked_asin order by count 					desc limit 5"
			connection.query(sql, asin, function (err, rows, fields) {
				if(err) throw err
				
				if(rows.length == 0){
					res.json({
						"message":"There are no recommendations for that product"	
					});
				}else{
					var jsonStr = '{"message":"The action was successful", "products":[]}';
					var obj = JSON.parse(jsonStr);
					for(var i=0;i<rows.length;i++){
						obj['products'].push({"asin":rows[i].linked_asin});
					}
					jsonStr = JSON.stringify(obj);
					res.json(JSON.parse(jsonStr));		
				}
				connection.release();
			});
		});
	}else{
		res.json({
			"message":"You are not currently logged in"
		});
	}
});

module.exports = router;
