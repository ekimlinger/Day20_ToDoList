var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString;

if(process.env.DATABASE_URL){
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/task_manager_DB';
}

router.get("/",function(req,res){
  pg.connect(connectionString,function(err,client,done){
    if(err){
      done();
      console.log("Error getting from server: ", err);
      res.status(500).send(err);
    } else{
      var result = [];
      var query = client.query('SELECT * FROM task_list;');
      query.on('row', function(row){
        done();
        result.push(row);
      });
      query.on('error', function(error){
        done();
        console.log("Error running get query: ", error);
      });
      query.on('end', function(end){
        done();
        res.send(result);
      });
    }
  });
});

router.post("/",function(req,res){
  pg.connect(connectionString,function(err,client,done){
    if(err){
      done();
      console.log("Error posting to server: ", err);
      res.status(500).send(err);
    } else{
      var result = [];
      var taskName = req.body.task_name;
      var taskDescription = req.body.task_description
      var query = client.query('INSERT INTO task_list '+
                                '(task_name, task_description) '+
                                "VALUES ($1, $2)"+
                                'RETURNING id, task_name, task_description, task_complete;', [taskName, taskDescription]);
      query.on('row', function(row){
        done();
        result.push(row);
      });
      query.on('error', function(error){
        done();
        console.log("Error running get query: ", error);
      });
      query.on('end', function(end){
        done();
        res.send(result);
      })
    }
  });
});

router.put("/",function(req,res){
  pg.connect(connectionString, function(err,client,done){
    if (err){
      done();
      console.log("Could not change DB: "+ err);
      res.status(500).send(err);
    } else{
      var id = req.body.completeId;
      var result = [];
      var query = client.query("UPDATE task_list SET task_complete='true'" +
                                'WHERE id = ($1) ' +
                                'RETURNING id, task_name, task_description, task_complete;', [id]);
      query.on('row', function(row){
        done();
        result.push(row);
      });
      query.on('error', function(error){
        done();
        console.log("Error running query: "+ error);
      });
      query.on('end',function(end){
        done();
        res.send(result);
      });
    }
  });
});

router.delete("/", function(req,res){
  pg.connect(connectionString, function(err,client,done){
    if (err){
      done();
      console.log("Could not delete from DB: "+ err);
      res.status(500).send(err);
    } else{
      var id = req.body.deleteId;
      var result = [];
      var query = client.query('DELETE FROM task_list ' +
                                'WHERE id = ($1) ' +
                                'RETURNING id, task_name, task_description, task_complete;', [id]);
      query.on('row', function(row){
        done();
        result.push(row);
      });
      query.on('error', function(error){
        done();
        console.log("Error running query: "+ error);
      });
      query.on('end',function(end){
        done();
        res.send(result);
      });
    }
  });
});


module.exports = router;
