const express = require('express');
const router = express.Router();
const ctrlHF = require('../../controllers/hiddenFaves.controller');

// get hidden/faves
router.get('/:which', ctrlHF.getHF);

// add to hidden/faves
router.post('/', ctrlHF.saveHF);

// remove from hidden/faves
router.post('/delete', ctrlHF.deleteHF);

// // delete all hidden/faves
router.delete('/:which', ctrlHF.deleteAll);

// takes date and deletes hiden/faves older than that date
router.post('/trim', ctrlHF.trimHF);

// swaps out current data set for a different one
// meant to be used in such a way that the user clicks a button to merge which sends all hidden or faves results that apply to that current data set
router.put('/merge', ctrlHF.mergeHF);

module.exports = router;
