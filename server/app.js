var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');
var taskRoute = require('./routes/task.js');

var connectionString;



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

if(process.env.DATABASE_URL){
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/task_manager_DB';
}

//*********** CONNECTS TO DB TO CREATE TABLES ***********//
pg.connect(connectionString, function(err, client,done){
  if (err){
    console.log('Error connecting to the DB: ', err)
  } else{
    var query = client.query(

      //  CREATES employee_table,
      //          columns:        id, name, number, job, salary

      'CREATE TABLE IF NOT EXISTS task_list (' +
      'id SERIAL PRIMARY KEY,'+
      'task_name varchar(100) NOT NULL,'+
      'task_description varchar(160) NOT NULL,'+
      "task_complete BOOLEAN DEFAULT 'false');"
    );

    query.on('end',function(){
      done();
      console.log('Successfully ensured our tables exists');
    });

    query.on('error', function(error){
      done();
      console.log('Error creating table', error);
    });
  }
});


app.use('/task', taskRoute);

app.get("/*", function(req,res){
  var file = req.params[0] || "/views/index.html";
  res.sendFile(path.join(__dirname,"/public/", file));
});

app.set("port",(process.env.PORT || 3000));

app.listen(app.get("port"),function(){
  console.log("Listening on port: ", app.get("port"));
});

module.exports = connectionString;
