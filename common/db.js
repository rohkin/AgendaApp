var mysql = require('mysql');

connection = mysql.createConnection({
	host     : process.env.SQL_SERVER,
	user     : process.env.SQL_UID,
	password : process.env.SQL_PWD,
	database : process.env.SQL_DB
});