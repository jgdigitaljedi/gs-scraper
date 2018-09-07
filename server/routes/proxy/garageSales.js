const express = require('express');
const router = express.Router();
const estateSales = require('./sales/estatesales');

router.post('/estatesales', (req, res) => {
  estateSales.getEstateSales(req.body, res);
  // .then(result => {
  //   res.status(200).json(result);
  // })
  // .catch(err => {
  //   res.status(500).json(err);
  // });
});

module.exports = router;