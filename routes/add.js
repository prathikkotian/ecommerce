var express = require('express');
var router = express.Router();
var session;

/* Addition of two numbers */
router.post('/', function(req, res, next) {
  session = req.session;
  console.log(req.body);
	if(session.uniqueID){
		var num1 = req.body.num1;
		var num2 = req.body.num2;
		console.log(session.uniqueID);
		if(Number.isInteger(num1) && Number.isInteger(num2)){
			res.json({
				"message":"The action was successful",
				"result":num1 + num2
			});
		}else{	
			res.json({
				"message":"The numbers you entered are not valid"
			});
		}
	}else{
		res.json({
			"message":"You are not currently logged in"
		});
	}
});

module.exports = router;
