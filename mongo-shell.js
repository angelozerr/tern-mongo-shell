(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    return mod(require("tern/lib/infer"), require("tern/lib/tern"));
  if (typeof define == "function" && define.amd) // AMD
    return define([ "tern/lib/infer", "tern/lib/tern" ], mod);
  mod(tern, tern);
})(function(infer, tern) {
  "use strict";
  
  function listCollections(callback) {
    
  }
  
  if (require) (function() {
    listCollections = function(callback) {
      var MongoClient = require('mongodb').MongoClient, assert = require('assert');
    
      // Connection URL
      var url = 'mongodb://localhost:27017/test';
      // Use connect method to connect to the Server
      MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
    
        db.listCollections({
          namesOnly : true
        }, function(err, names) {
          callback(names);
          db.close();
        });
    
      });
    }
  })();
  
  function buildWrappingScope(parent, origin, node) {
    var scope = new infer.Scope(parent);
    scope.originNode = node;    
    var cx = infer.cx(), locals = cx.definitions["mongo-shell"];
    var db = new infer.Obj(locals["DB"].getType().getProp("prototype").getType());
    db.propagate(scope.defProp("db"));  
    
    listCollections(function(names) {
      for (var i = 0; i < names.length; i++) {
        var col = new infer.Obj(locals["Collection"].getType().getProp("prototype").getType());
        db.propagate(new infer.PropHasSubset(names[0], col));          
      }
    });
    
    return scope;
  }
  
  infer.registerFunction("mongoDBInstance", function(_self, args, argNodes) {
    var cx = infer.cx(), locals = cx.definitions["mongo-shell"];
    return new infer.Obj(locals["DB"].getType().getProp("prototype").getType());    
  });
  
  tern.registerPlugin("mongo-shell", function(server, options) {
    server.on("beforeLoad", function(file) {
      file.scope = buildWrappingScope(file.scope, file.name, file.ast);
    });
    return {
      defs : defs
    };
  });
  
  var defs = {
    "!name": "mongo-shell",
    "!define": {
      "Collection": {
        "!type": "fn()",
        "prototype": {
          "getMongo": {
            "!type": "fn() -> +Mongo"
          }
        }
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
      }
    }
  }

});