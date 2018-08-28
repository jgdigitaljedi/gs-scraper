const express = require('express');
const router = express.Router();
const ctrlHidden = require('../../controllers/hidden.controller');

// get hidden
router.get('/', ctrlHidden.getHidden);

// // add to hidden
// router.post('/', (req, res) => {

// });

// // remove from hidden
// router.delete('/', (req, res) => {

// });

// // delete all hidden
// router.delete('/all', (req, res) => {

// });

module.exports = router;
