const mysql      = require('mysql');

let db_connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'registered_users'
});

db_connection.connect(function(err){
  if(!err) {
      console.log("Database is connected ... nn");
  } else {
      console.log("Error connecting database ... nn");
  }
});

exports.register = function(req,res) {
  const today = new Date();
  let users = {
    "first_name":req.body.first_name,
    "last_name":req.body.last_name,
    "email":req.body.email,
    "password":req.body.password,
    "created":today,
    "modified":today
  }

  db_connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
    if (error) {
      console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      });
    } else {
      console.log('The solution is: ', results);
      res.send({
        "code":200,
        "success":"user registered sucessfully"
      });
    }
  });
}

exports.login = function(req,res){
  let email= req.body.email;
  let password = req.body.password;
  db_connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
    if (error) {
      res.send({
        "code":400,
        "failed":"error ocurred"
      });
    } else {
      if (results.length > 0) {
        if (results[0].password == password) {
          res.send({
            "code":200,
            "success":"login sucessfull"
          });
        } else {
          res.send({
            "code":204,
            "success":"Email and password does not match"
          });
        }
      }
      else {
        res.send({
          "code":204,
          "success":"Email does not exits"
        });
      }
  }
  });
}
