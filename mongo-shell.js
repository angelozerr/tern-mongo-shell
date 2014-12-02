(function(mod) {
  if (typeof exports == "object" && typeof module == "object") { // CommonJS
    return mod(require("tern/lib/infer"), require("tern/lib/tern"));
  }
  if (typeof define == "function" && define.amd) // AMD
    return define([ "tern/lib/infer", "tern/lib/tern" ], mod);
  mod(tern, tern);
})(function(infer, tern) {
  "use strict";

  /*if (require) {
    var MongoClient = require('mongodb').MongoClient, assert = require('assert');

    // Connection URL
    var url = 'mongodb://localhost:27017/test';
    // Use connect method to connect to the Server
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);

      db.listCollections({
        namesOnly : true
      }, function(err, names) {
        console.log(names);
        db.close();
      });

    });
  }*/
  
  tern.registerPlugin("mongo-shell", function(server, options) {

    return {
      defs : defs
    };
  });
  
  var defs = {
	  "!name": "mongo-shell",
	  "!define": {
	  },
	  "DB": {
	    "!type": "fn(mongo: ?, name: string)",
	    "prototype": {
	      "getMongo": {
	        "!type": "fn() -> +Mongo"
	      }
	    }
	  },
	  "Mongo": {
	    "prototype": {
	      "find": {
	        "!type": "fn(ns: ?, query: ?, fields: ?, limit: ?, skip: ?, batchSize: ?, options: ?)"
	      }
	    }
	  },
	  "db": {
	    "!type": "+DB"
	  }
  }

});