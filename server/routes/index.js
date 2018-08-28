const express = require('express');
const router = express.Router();

router.use('/offerup', require('./proxy/offerUp'));

router.use('/cl', require('./proxy/craigslist'));

router.use('/letgo', require('./proxy/letgo'));

router.use('/hidden', require('./actions/hidden'));

router.use('/faves', require('./actions/faves'));

module.exports = router;
