var express = require('express');
var router = express.Router();
var isNull = require('is-null-or-empty');
var connection = require('./connection');

/* buying new products */
router.post('/', function(req, res, next) {
var session;
  session = req.session;
	if(session.uniqueID){
		var jsonStr = req.body.products;
		try{
			var obj = JSON.stringify(jsonStr);
			var jsonObj = JSON.parse(obj);
		}catch(err){
			console.log("error");
			throw err
		}
		
		var asin = [];
		for(var i in jsonObj){	
			asin.push(jsonObj[i]["asin"]);	
		}
		connection.getConnection(function(err, connection){
			var select_sql = "select count(asin) as count from products where asin in (?)";
			connection.query(select_sql, [asin], function (err, rows, fields) {
				if (rows[0].count != asin.length) {
					res.json({
						"message":"There are no products that match that criteria"
					});	
				}else{
					var purchase_sql = "insert into purchase (asin, username) values ?";
					var purchases = [];
					for(var i in asin){
						purchases.push([asin[i], session.uniqueID]);
					}
					connection.query(purchase_sql, [purchases], function (err, rows, fields) {
						if(err) throw err
						var recommendations_sql = "insert into recommendations (asin,linked_asin) values ?";
						var recommendations = [];
						for(var i in asin){
							for(var j in asin){
								if(i != j){
									recommendations.push([asin[i], asin[j]]);	
								}						
							}
						}
						connection.query(recommendations_sql, [recommendations], function (err, rows, fields) {		
							if(err) throw err
							res.json({
								"message":"The action was successful"
							});
						});
					});					
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
