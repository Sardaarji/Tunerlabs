
const service = require('./service');

exports.createCompany = function (req, res) {
  service.createCompanyService(req, res)
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((error) => {
      return res.status(error.statusCode || 500).send(error);
    })
}

exports.updateCompany = function (req, res) {
  service.updateCompanyService(req, res)
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((error) => {
      return res.status(error.statusCode || 500).send(error);
    })
}