const express = require('express');
const router = express.Router();
const priceCtrl = require('../../controllers/ebay.controller');

router.post('/', priceCtrl.getEbayPrices);

module.exports = router;