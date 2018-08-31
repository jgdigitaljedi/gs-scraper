const express = require('express');
const router = express.Router();
const ctrlHidden = require('../../controllers/hidden.controller');

// get hidden
router.get('/', ctrlHidden.getHidden);

// // add to hidden
router.post('/', ctrlHidden.saveHidden);

// // remove from hidden
router.post('/delete', ctrlHidden.deleteHidden);

// delete all hidden
router.delete('/', ctrlHidden.deleteAll);

module.exports = router;
