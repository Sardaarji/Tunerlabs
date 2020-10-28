const dbConfig = require('../mongo/mongoConfig');
const companyCollection = require('../config/config').companyCollection;




exports.createCompanyDAL = function (companyObject) {

  const db = dbConfig.tunerDatabase;
  const companyId = companyObject.cid;

  return new Promise((resolve, reject) => {

    db.collection(companyCollection).findOne({ $or: [{ cid: companyId }, { cname: companyObject.cname }] })
      .then((result) => {
        if (result) {
          //company already exists

          return reject({
            success: false,
            message: `company already exists with company ID : ${companyId} or company Name : ${companyObject.cname}`,
            statusCode: 400
          })

        } else {
          return db.collection(companyCollection).insertOne(companyObject);
        }
      })
      .then((result) => {
        return resolve({
          message: "company created successfully",
          statusCode: 200,
          success: true,
          companyId
        })
      })
      .catch((error) => {
        return reject({
          success: false,
          message: error.message || "company creation failed",
          statusCode: error.statusCode || 500
        })
      })
  })
}


exports.updateCompanyDAL = function (companyId, companyObject) {

  const db = dbConfig.tunerDatabase;

  return new Promise(async (resolve, reject) => {

    let query = { cid: companyId };

    if (companyObject.cname) {
      let obj = await db.collection(companyCollection).findOne({ cname: companyObject.cname });
      if (obj) {
        return reject({
          success: false,
          message: "Cannot Update company details as company name already exists",
          statusCode: 400
        })
      }
    }

    db.collection(companyCollection).findOne(query)
      .then((result) => {
        if (result) {
          return db.collection(companyCollection).updateOne(query, { $set: companyObject });
        }
        else {
          return reject({
            success: false,
            message: "company Not Found",
            statusCode: 404
          })
        }
      })
      .then((result) => {
        return resolve({
          success: true,
          message: "company updated successfully",
          statusCode: 200
        })
      })
      .catch((error) => {
        return reject({
          success: false,
          message: error.message || "company updation failed",
          statusCode: error.statusCode || 500
        })
      })
  })

}