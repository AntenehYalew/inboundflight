require("dotenv").config();
const mysql          = require("mysql"),

bcrypt         = require("bcrypt"),
saltRounds     = 10;


  var con  = mysql.createPool({
    connectionLimit : 10,
    host     : process.env.RDS_HOSTNAME,
    user     : process.env.RDS_USERNAME,
    password : process.env.RDS_PASSWORD,
    database : process.env.RDS_DB_NAME,
    port     : process.env.RDS_PORT,
  });
  
  con.getConnection(function(err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
    console.log('Connected to MySql database.');
  });
  
 /*  con.end(function(err) {
    console.log("connection terminated")
  }); */
  module.exports = con;







//admin appeshaadmin@2020
//boskkqr boston@2020
//tstkkqr test@2020



//Create Table
/* CREATE TABLE usermgt(
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    user_name CHAR(6) NOT NULL,
    salt BINARY(64) NOT NULL,
    hash VARBINARY(2000) NOT NULL) */

//Create ADMIN USER and PASSWOrD
/* INSERT INTO usermgt (user_name, user_password, user_station, user_flightNumber) VALUES ("ADMIN", "APPESHAADMIN@2020", "HDQ", "HDQ0000") */ 
/*     var user_name = "ADMIN"
var user_password = "APPESHAADMIN@2020" 
bcrypt.hash(user_password,saltRounds, function(err,hash){
  if(!err){
    console.log(hash)
    con.query("INSERT INTO usermgt (user_name, user_password, user_station, user_flightNumber) VALUES ('"+ user_name +"','"+ hash + "','HDQ', 'HDQ0000')",(err, result)=>{
      if(!err){
        console.log("admin added")
      }else{
        console.log(err)
      }
    })
  }
}) */


//BOSKKQR

//TEAMBOSTON