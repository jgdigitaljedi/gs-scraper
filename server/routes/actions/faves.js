const express = require('express');
const router = express.Router();
const favesCtrl = require('../../controllers/faves.controller');

// get faves
router.get('/', favesCtrl.getFaves);

// add to faves
router.post('/', favesCtrl.saveFave);

// // remove from faves
router.delete('/', favesCtrl.deleteFave);

// // delete all faves
// router.delete('/all', (req, res) => {

// });

module.exports = router;
