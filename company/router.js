const express = require('express');

const router = express.Router();

const controller = require('./controller');
const verifyJWT = require('../middlewares/verifyJwt').verifyToken;

router.post('/create', verifyJWT, (req, res) => {
  controller.createCompany(req, res);
});

router.put('/update', verifyJWT, (req, res) => {
  controller.updateCompany(req, res);
});


module.exports = router;