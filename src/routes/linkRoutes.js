const express = require('express');
const { generateLink, verifyLink } = require('../controllers/linkController');
const router = express.Router();

router.post('/generate', generateLink);

router.get('/verify-link', verifyLink);

module.exports = router;
