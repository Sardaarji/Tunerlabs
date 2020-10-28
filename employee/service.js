const dal = require('./dal');
const shortId = require('shortid');


exports.createEmployeeService = function (req, res) {

  const employeeObject = req.body || {};

  return new Promise((resolve, reject) => {

    if (employeeObject.cid && employeeObject.reportingManager
      && employeeObject.name && employeeObject.phoneNumber
      && employeeObject.role && employeeObject.password) {

      employeeObject['eid'] = shortId();
      employeeObject['name'] = employeeObject['name'].toLowerCase();

      dal.createEmployeeDAL(req, employeeObject)
        .then((result) => {
          return resolve(result);
        })
        .catch((error) => {
          return reject(error);
        })

    } else {
      return reject({
        message: "All Fields are Mandatory",
        statusCode: 400,
        success: false
      });
    }
  })
}

exports.updateEmployeeService = function (req, res) {

  let employeeObject = req.body || {};
  const employeeId = employeeObject['eid'];

  return new Promise((resolve, reject) => {

    if (!employeeObject.cid) {

      if (employeeId) {

        if (employeeObject['name']) {
          employeeObject['name'] = employeeObject['name'].toLowerCase();
        }

        employeeObject = cleanObject(employeeObject);

        dal.updateEmployeeDAL(req, employeeId, employeeObject)
          .then((result) => {
            return resolve(result);
          })
          .catch((error) => {
            return reject(error);
          })

      } else {

        return reject({
          success: false,
          message: "Employee Id is Mandatory",
          statusCode: 400
        });
      }

    } else {
      return reject({
        message: "Company Id is non updateble",
        statusCode: 400,
        success: false
      });
    }

  });
}


exports.listEmployeeDetailsService = function (req, res) {
  return new Promise((resolve, reject) => {

    let employeeObject = req.query || {};
    const employeeId = employeeObject.eid;

    if (employeeId) {
      dal.listEmployeeDetailsDAL(req, employeeId)
        .then((result) => {
          return resolve(result);
        })
        .catch((error) => {
          return reject(error);
        })
    } else {
      return reject({
        success: false,
        message: "Employee Id is Mandatory",
        statusCode: 400
      });
    }
  })
}


exports.searchEmployeeService = function (req, res) {

  let searchObject = req.query || {};

  return new Promise((resolve, reject) => {

    if (Object.keys(searchObject).length > 0) {

      searchObject['name'] ? searchObject['name'] = searchObject['name'].toLowerCase() : "";

      dal.searchEmployeeDAL(req, searchObject)
        .then((result) => {
          return resolve(result);
        })
        .catch((error) => {
          return reject(error);
        })
    } else {

      return reject({
        success: false,
        message: "Search Object cannot be empty",
        statusCode: 400
      });

    }

  })
}




exports.adminLoginService = function (req, res) {

  let loginCredentials = {
    phoneNumber: req.body.phoneNumber,
    password: req.body.password
  }

  return new Promise((resolve, reject) => {

    if (loginCredentials['phoneNumber'] && loginCredentials['password']) {

      dal.adminLoginDAL(req, loginCredentials)
        .then((result) => {
          return resolve(result);
        })
        .catch((error) => {
          return reject({
            "message": error.message,
            "statusCode": error.statusCode || 500,
            "success": false
          });
        })

    } else {

      return reject({
        "message": " phoneNumber, password  are mandatory fields",
        "statusCode": 400,
        "success": false
      });
    }

  });

}


cleanObject = function (object) {
  Object
    .entries(object)
    .forEach(([k, v]) => {
      if (v && typeof v === 'object')
        cleanObject(v);
      if (v &&
        typeof v === 'object' &&
        !Object.keys(v).length ||
        v === null ||
        v === undefined ||
        v.length === 0
      ) {
        if (Array.isArray(object))
          object.splice(k, 1);
        else if (!(v instanceof Date))
          delete object[k];
      }
    });
  return object;
}