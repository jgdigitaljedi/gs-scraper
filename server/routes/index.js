const express = require('express');
const router = express.Router();

router.use('/offerup', require('./offerUp'));

module.exports = router;
