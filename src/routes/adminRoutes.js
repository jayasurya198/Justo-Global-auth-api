const express = require('express');
const { kickout } = require('../controllers/adminController');
const router = express.Router();

router.post('/kickout', kickout);

module.exports = router;
