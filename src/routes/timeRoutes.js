const express = require('express');
const { getTime } = require('../controllers/timeController');
const router = express.Router();

router.get('/', getTime);

module.exports = router;
