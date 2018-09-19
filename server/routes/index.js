const express = require('express');
const router = express.Router();

router.use('/offerup', require('./proxy/offerUp'));

router.use('/cl', require('./proxy/craigslist'));

router.use('/letgo', require('./proxy/letgo'));

router.use('/garagesales', require('./proxy/garageSales'));

router.use('/oodle', require('./proxy/oodle'));

router.use('/varage', require('./proxy/varageSale'));

router.use('/pricecheck', require('./actions/ebayPrice'));

router.use('/storage', require('./actions/hiddenFaves'));

module.exports = router;
