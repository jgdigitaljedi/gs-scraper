const express = require('express');
const router = express.Router();
const favesCtrl = require('../../controllers/faves.controller');

// get faves
router.get('/', favesCtrl.getFaves);

// add to faves
router.post('/', favesCtrl.saveFave);

// // remove from faves
router.post('/delete', favesCtrl.deleteFave);

// delete all faves
router.delete('/', favesCtrl.deleteAllFaves);

module.exports = router;
