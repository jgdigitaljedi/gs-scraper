const logger = require('../config/logger');
const mongoose = require('mongoose');
const Result = mongoose.model('Result');

module.exports.getHidden = (req, res) => {
  Result.find({}, function (err, result) {
    if (err) {
      logger.logThis(err, req);
      res.status(500).json({ error: true, message: 'ERROR: Error fetching hidden results list!', code: err });
    }
    if (result && result.length) {
      const hidden = result.filter(r => r.action === 'hidden');
      res.status(200).send({ error: false, payload: hidden });
    }
  });
};
