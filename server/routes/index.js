const express = require('express');
const router = express.Router();

router.use('/offerup', require('./offerUp'));

router.use('/cl', require('./craigslist'));

router.use('/letgo', require('./letgo'));

module.exports = router;
