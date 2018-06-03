var express = require('express');
var router = express.Router();
var session;

/* Division of two numbers */
router.post('/', function(req, res, next) {
  session = req.session;
	if(session.uniqueID){
		var num1 = req.body.num1;
		var num2 = req.body.num2;
		if(Number.isInteger(num1) && Number.isInteger(num2) && num2 != 0){
			res.json({
				"message":"The action was successful",
				"result":num1 / num2
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
