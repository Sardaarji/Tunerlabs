
const service = require('./service');

exports.createEmployee = function (req, res) {

  service.createEmployeeService(req, res)
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((error) => {
      return res.status(error.statusCode || 500).send(error);
    })
}

exports.updateEmployee = function (req, res) {
  service.updateEmployeeService(req, res)
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((error) => {
      return res.status(error.statusCode || 500).send(error);
    })
}


exports.listEmployeeDetails = function (req, res) {

  service.listEmployeeDetailsService(req, res)
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((error) => {
      return res.status(error.statusCode || 500).send(error);
    })
}


exports.searchEmployee = function (req, res) {

  service.searchEmployeeService(req, res)
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((error) => {
      return res.status(error.statusCode || 500).send(error);
    })
}

exports.adminLogin = function (req, res) {
  service.adminLoginService(req, res)
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((error) => {
      return res.status(error.statusCode || 500).send(error);
    })
}