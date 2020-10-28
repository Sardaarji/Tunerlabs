var TAG = 'mongoDatabase.js';
var mongoClient = require('mongodb').MongoClient;
var async = require('async');
const dbUrl = require('../config/config').dbUrl;


exports.createMongoConn = function (req, res, next) {
  var dbName;
  if (req.body && req.body.cid) {
    dbName = req.body.cid;
  } else if (req.employeeData) {
    dbName = req.employeeData.cid;
  }

  if (!dbName) {
    return res.status(400).send({
      message: "Company Id is Mandatory",
      success: false,
      statusCode: 400
    });
  }

  const url = dbUrl + dbName;

  var option = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  var mongoDbConn = null;
  async.parallel([
    function (asyncCallback) {
      mongoClient.connect(url, option, function (err, database) {
        if (err) {
          asyncCallback(err, null);
        } else {
          console.log('Connection established to: ', url);
          req['dbName'] = dbName;
          req['db'] = database;
          req["mongoDbConn"] = database.db(dbName);
          asyncCallback(null, false);
        }
      });
    },
  ],
    function (err, results) {
      if (err) {
        console.log('Error connecting to DB. Err : \n' + err.stack);
      } else {
        console.log('DB connection successfull.');
        next();
      }
    });
}