
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const verifyToken = (req, res, next) => {

  const jwtToken = req.headers["authorization"];

  if (!jwtToken) {
    return res.status(400).send({
      message: 'JWT Token is not present',
      statusCode: 400,
      success: false
    });
  } else {
    jwt.verify(jwtToken, config.jwtVerificationKey, (err, decoded) => {
      if (err) {
        req.authenticated = false;
        req.employeeData = null;
        return res.status(401).send({
          message: 'Unauthorized',
          statusCode: 401,
          success: false
        });
      } else {
        req.employeeData = decoded;
        req.authenticated = true;

        next();
      }
    });
  }
}

module.exports = {
  verifyToken
};