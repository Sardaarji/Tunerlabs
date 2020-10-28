const async = require('async');
const mongoClient = require('mongodb').MongoClient;
const dbUrl = require('../config/config').dbUrl;


const dbName = 'tunerlabs';
const url = dbUrl + dbName;

var tunerDatabase = null;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}



exports.createMongoConnection = (callback) => {
  async.parallel([function (asyncCallback) {

    mongoClient.connect(url, options, (err, database) => {

      if (err) {

        asyncCallback(err, null);

      } else {

        exports.tunerDatabase = database.db(dbName);

        asyncCallback(null, null);

      }

    })

  }],

    (err, results) => {
      if (err) {
        console.log("Error in mongo connection");
      } else {
        console.log("Success in mongo connection");
        callback(false);

      }
    })
}