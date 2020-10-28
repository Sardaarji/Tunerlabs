const dbConfig = require('../mongo/mongoConfig');
const { companyCollection, adminRole, employeeCollection, sessionCollection } = require('../config/config');
const { v4: uuidV4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



exports.createEmployeeDAL = function (req, employeeObject) {

  const db = req.mongoDbConn;
  const database = req.db;
  const tunerDb = dbConfig.tunerDatabase;

  return new Promise((resolve, reject) => {
    tunerDb.collection(companyCollection).findOne({ cid: employeeObject.cid })
      .then((result) => {
        if (result) {
          return db.collection(employeeCollection).findOne({
            $or: [{ eid: employeeObject.eid },
            { phoneNumber: employeeObject.phoneNumber }]
          });
        } else {

          database.close();
          return reject({
            message: "Company Not Found",
            statusCode: 404,
            success: false
          });
        }
      })
      .then((result) => {
        if (result) {

          database.close();

          return reject({
            message: "Employee already exists with this employee Id or Phone Number",
            statusCode: 400,
            success: false
          });
        } else {
          if (employeeObject.role === adminRole) {
            return Promise.resolve("Admin");
          } else {
            return db.collection(employeeCollection).findOne({ eid: employeeObject.reportingManager });
          }
        }
      })
      .then((result) => {
        if (result) {
          return bcrypt.hash(employeeObject['password'], 10);
        } else {
          return reject({
            message: "Reporting manager not found",
            statusCode: 404,
            success: false
          });
        }
      })
      .then((hash) => {
        if (hash) {
          employeeObject['password'] = hash;
          return db.collection(employeeCollection).insertOne(employeeObject);
        }
      })
      .then((result) => {
        database.close();
        return resolve({
          message: "Employee created successfully",
          statusCode: 200,
          success: true
        });
      })
      .catch((error) => {
        if (database) {
          database.close();
        }
        return reject({
          success: false,
          message: error.message || "Internal Server Error",
          statusCode: error.statusCode || 500
        })
      })
  })
}


exports.updateEmployeeDAL = function (req, employeeId, employeeObject) {

  const db = req.mongoDbConn;
  const database = req.db;

  return new Promise(async (resolve, reject) => {
    try {
      let query = { eid: employeeId };

      if (employeeObject.phoneNumber || employeeObject.reportingManager) {

        if (employeeObject.phoneNumber) {
          const result = await db.collection(employeeCollection).findOne({ phoneNumber: employeeObject.phoneNumber });
          if (result) {
            database.close();
            return reject({
              success: false,
              message: "employee with this phone number already exists",
              statusCode: 400
            })
          }
        }

        if (employeeObject.reportingManager) {
          const result = await db.collection(employeeCollection).findOne({ reportingManager: employeeObject.reportingManager });
          if (!result) {
            database.close();
            return reject({
              success: false,
              message: "Reporting Manager Not Found",
              statusCode: 404
            })
          }
        }
      }

      db.collection(employeeCollection).findOne(query)
        .then((result) => {
          if (result) {
            return db.collection(employeeCollection).updateOne(query, { $set: employeeObject });
          }
          else {
            database.close();
            return reject({
              success: false,
              message: "employee Not Found",
              statusCode: 404
            })
          }
        })
        .then((result) => {
          database.close();
          return resolve({
            success: true,
            message: "employee updated successfully"
          })
        })
        .catch((error) => {
          if (database) {
            database.close();
          }
          return reject({
            success: false,
            message: error.message || "employee updation failed",
            statusCode: error.statusCode || 500
          })
        })

    } catch (error) {
      if (database) {
        database.close();
      }
      return reject({
        success: false,
        message: error.message || "Internal Server Error",
        statusCode: error.statusCode || 500
      })
    }
  })

}



exports.listEmployeeDetailsDAL = function (req, employeeId) {

  const db = req.mongoDbConn;
  const database = req.db;

  return new Promise((resolve, reject) => {

    let responseObj = {};
    let filterObj = {
      _id: 0,
      eid: 1,
      name: 1,
      reportingManager: 1
    }

    db.collection(employeeCollection).findOne({ eid: employeeId })
      .then((result) => {
        if (result) {
          responseObj['reportingManager'] = result.reportingManager;
          return db.collection(employeeCollection).find({ reportingManager: employeeId }).project(filterObj).toArray();
        } else {
          return reject({
            message: "employee Not Found",
            success: false,
            statusCode: 404
          });
        }
      })
      .then((result) => {
        responseObj['subordinates'] = result;
        return resolve({
          success: true,
          message: "Employee Details",
          data: responseObj,
          statusCode: 200
        });

      })
      .catch((error) => {
        return reject({
          message: error.message || "Internal Server Error",
          success: false,
          statusCode: error.statusCode || 404
        });
      })
  })
}


exports.searchEmployeeDAL = function (req, searchObject) {

  const db = req.mongoDbConn;
  const database = req.db;

  return new Promise((resolve, reject) => {
    db.collection(employeeCollection).findOne(searchObject)
      .then((result) => {
        if (result) {
          delete result['_id'];
          delete result['password'];
          return resolve({
            success: true,
            statusCode: 200,
            message: "Employee Details",
            data: result
          });
        } else {
          return reject({
            message: "employee Not Found",
            success: false,
            statusCode: 404
          });
        }
      })
      .catch((error) => {
        return reject({
          success: false,
          message: error.message || "Internal Server Error",
          statusCode: error.statusCode || 500
        })
      })

  })

}



exports.adminLoginDAL = function (req, loginCredentials) {

  const db = req.mongoDbConn;
  const database = req.db;
  let employeeId, companyId;

  return new Promise((resolve, reject) => {

    db.collection(employeeCollection).findOne({ "phoneNumber": loginCredentials['phoneNumber'] })
      .then((employeeObj) => {

        if (employeeObj) {

          if (employeeObj['role'] === adminRole) {
            employeeId = employeeObj['eid'];
            companyId = employeeObj['cid'];

            return bcrypt.compare(loginCredentials['password'], employeeObj['password']);
          } else {
            return reject({
              "success": false,
              "message": "Only ADMIN's can Login",
              "statusCode": 400
            });
          }


        } else {
          return reject({
            "success": false,
            "message": "employee not found with specified phone Number",
            "statusCode": 404
          });
        }

      })
      .then((result) => {

        if (result) {

          let loginObj = {
            cid: companyId,
            phoneNumber: loginCredentials['phoneNumber'],
            eid: employeeId
          }

          return createSession(req, loginObj);

        } else {
          return reject({
            "success": false,
            "message": "Password Does not match",
            "statusCode": 401
          })
        }
      })
      .then((result) => {
        if (result) {
          result.message = "Login Successfull";
          return resolve(result);
        }
      })
      .catch((error) => {
        return reject({
          success: false,
          message: error.message || "Internal Server Error",
          statusCode: error.statusCode || 500
        });
      })
  })
}




createSession = (req, loginObj) => {

  const db = req.mongoDbConn;
  const database = req.db;

  let cid = loginObj.cid;
  let phoneNumber = loginObj.phoneNumber;
  let eid = loginObj.eid;
  let sessionId = uuidV4();


  let payload = {
    sessionId: sessionId,
    cid: cid,
    phoneNumber: phoneNumber,
    eid: eid
  }


  let token = jwt.sign(payload, 'marvels');

  let sessionObj = {
    sessionId: sessionId,
    cid: cid,
    eid: eid,
    phoneNumber: phoneNumber,
    startTime: new Date(),
    jwtToken: token
  }


  return new Promise((resolve, reject) => {

    db.collection(sessionCollection).insertOne(sessionObj)
      .then((result) => {

        return resolve({
          jwtToken: sessionObj.jwtToken,
          companyId: sessionObj.cid,
          employeeId: sessionObj.eid,
          statusCode: 200,
          success: true
        });

      })
      .catch((error) => {
        return reject({
          message: error.message || "Error while creating session",
          success: false,
          statusCode: error.statusCode || 500
        })
      })
  })
}