module.exports = {
	"userName" : process.env.SQL_UID,
	"password" : process.env.SQL_PWD,
	"server" : process.env.SQL_SERVER,
	"options" : {
		"connectTimeout" : 30000,
		"database" : process.env.SQL_DB,
		"encrypt" : true,
		"port" : process.env.SQL_PORT
	}
};