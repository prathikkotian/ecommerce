var express = require('express');
var mysql = require('mysql')

var pool = mysql.createPool({
	connectionLimit : 100,
	host     : 'mydb.cqnqn0tosh9o.us-east-1.rds.amazonaws.com',
	user     : 'root',
	password : 'ediss123',
	database : 'assignment2',
	multipleStatements: 'true'
});

module.exports.getConnection = function(callback) {
  pool.getConnection(function(err, conn) {
    if(err) {
      return callback(err);
    }
    callback(err, conn);
  });
}
