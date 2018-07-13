var express = require('express');
var router = express.Router();
var isNull = require('is-null-or-empty');
var connection = require('./connection');

/* view products */
router.post('/', function(req, res, next) {
var session;
  session = req.session;
//process.env.UV_THREADPOOL_SIZE = 10;
	var asin = req.body.asin;
	var keyword = req.body.keyword;
	var group = req.body.group;
	var sql;
	var phrase;

	if(!isNull(keyword)){
		if(keyword.length > 2){
			phrase = "match (product_name,product_description) against ('\"+"+keyword+"\"' in boolean mode)";
		}else{
			phrase = "(product_name like '%"+keyword+"%' or product_description like '%"+keyword+"%')";
		}	
	}

	if(isNull(asin) && isNull(keyword) && isNull(group)){
		sql = "select asin,product_name from products";
	}else if(isNull(asin) && isNull(keyword) && !isNull(group)){
		sql = "select asin,product_name from products where groups ='"+group+"'";
	}else if(isNull(asin) && !isNull(keyword) && isNull(group)){
		sql = "select asin, product_name from products where "+phrase;		
	}else if(!isNull(asin) && isNull(keyword) && isNull(group)){
		sql = "select asin,product_name from products where asin='"+asin+"'";
	}
	else if(isNull(asin) && !isNull(keyword) && !isNull(group)){
		sql = "select asin, product_name from products where "+phrase+" and groups ='"+group+"'";	
	}else if(!isNull(asin) && isNull(keyword) && !isNull(group)){
		sql = "select asin,product_name from products where asin='"+asin+"' and groups ='"+group+"'";	
	}else if(!isNull(asin) && !isNull(keyword) && isNull(group)){
		sql = "select asin,product_name from products where asin='"+asin+"' and "+phrase;	
	}else{
		sql = "select asin,product_name from products where asin='"+asin+"' and "+phrase+" and groups = '"+group+"'";	
	}
	
	connection.getConnection(function(err, connection){
		if(err) throw err
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
