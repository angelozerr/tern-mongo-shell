var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/test';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  
  db.listCollections({namesOnly:true}, function(err, names) {
    console.log(names);
    db.close();
  });

});