var express = require('express');
var mysql = require('mysql')

module.exports = function() { 
//DB Connection Properties
    this.conn = function() { 
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'assignment2'
});
return connection;
};
}
