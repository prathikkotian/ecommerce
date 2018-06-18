var express = require('express');
var router = express.Router();
var isNull = require('is-null-or-empty');
var connection = require('./connection');

/* view products */
router.post('/', function(req, res, next) {
var session;
  session = req.session;

	var asin = req.body.asin;
	var keyword = req.body.keyword;
	var group = req.body.group;
	
	if(isNull(keyword))
		keyword='';
	if(isNull(group))
		group='';
	
	var sql;
	if(isNull(asin)){
		sql = "select asin,product_name from products where (product_name like '%"+keyword+"%' or product_description like 				'%"+keyword+"%') and groups like '%"+group+"%'";	
	}else{
		sql = "select asin,product_name from products where asin = '"+asin+"' and (product_name like '%"+keyword+"%' or 			product_description like '%"+keyword+"%') and groups like '%"+group+"%'";
	}
	connection.getConnection(function(err, connection){
		connection.query(sql, function (err, rows, fields) {
			if(err) throw err
			
			if(rows.length == 0){
				res.json({
					"message":"There are no products that match that criteria"	
				});
			}else{
				var jsonStr = '{"product":[]}';
				var obj = JSON.parse(jsonStr);
				for(var i=0;i<rows.length;i++){
					obj['product'].push({"asin":rows[i].asin,"productName":rows[i].product_name});
				}
				jsonStr = JSON.stringify(obj);
				res.json(JSON.parse(jsonStr));		
			}
			connection.release();
		});
	});

});

module.exports = router;
