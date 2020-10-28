const dal = require('./dal');


exports.createCompanyService = function (req, res) {

  const companyObject = req.body || {};

  return new Promise((resolve, reject) => {

    if (companyObject.cname) {

      companyObject['cid'] = String(Math.floor(1000 + Math.random() * 9000));

      dal.createCompanyDAL(companyObject)
        .then((result) => {
          return resolve(result);
        })
        .catch((error) => {
          return reject(error);
        })

    } else {
      return reject({
        success: false,
        message: "Company Name is a Mandatory Field",
        statusCode: 400
      });
    }

  })

}

exports.updateCompanyService = function (req, res) {

  const companyObject = req.body || {};
  const companyId = companyObject['cid'];

  return new Promise((resolve, reject) => {

    if (companyId) {
      dal.updateCompanyDAL(companyId, companyObject)
        .then((result) => {
          return resolve(result);
        })
        .catch((error) => {
          return reject(error);
        })
    } else {
      return reject({
        success: false,
        message: "Company Id is Mandatory",
        statusCode: 400
      });
    }

  });

}