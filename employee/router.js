const express = require('express');
const databaseMiddleware = require('../middlewares/database').createMongoConn;
const verifyJWT = require('../middlewares/verifyJwt').verifyToken;

const router = express.Router();

const controller = require('./controller');

router.post('/create', verifyJWT, databaseMiddleware, (req, res) => {
  controller.createEmployee(req, res);
});

router.put('/update', verifyJWT, databaseMiddleware, (req, res) => {
  controller.updateEmployee(req, res);
});

router.get('/list', verifyJWT, databaseMiddleware, (req, res) => {
  controller.listEmployeeDetails(req, res);
});

router.get('/search', verifyJWT, databaseMiddleware, (req, res) => {
  controller.searchEmployee(req, res);
});

router.post('/login', databaseMiddleware, (req, res) => {
  controller.adminLogin(req, res);
});


module.exports = router;