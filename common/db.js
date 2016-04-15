var mysql = require('mysql');

pool = mysql.createPool({
	connectionLimit: 10,
	host     : process.env.SQL_SERVER,
	user     : process.env.SQL_UID,
	password : process.env.SQL_PWD,
	database : process.env.SQL_DB
});