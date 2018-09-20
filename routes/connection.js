/*
DB connection module
@author: Prathik Kotian
@module: routes/connection
*/
var express = require('express');
var mysql = require('mysql')
require('dotenv').config()

var pool = mysql.createPool({
	connectionLimit : 100,
	host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS
	database: process.env.DB_NAME
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
