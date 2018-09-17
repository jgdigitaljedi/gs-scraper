const logger = require('../config/logger');
// const rCtrl = require('./result.controller');
const mongoose = require('mongoose');
const Result = mongoose.model('Result');
const parse = require('date-fns/parse');
const subDays = require('date-fns/sub_days');
const isBefore = require('date-fns/is_before');

function removeArr(arr) {
  return Result.remove({ _id: { $in: arr.map(mongoose.Types.ObjectId) } });
}

module.exports.trimHF = function(req, res) {
  if (req && req.body && req.body.hasOwnProperty('which') && req.body.hasOwnProperty('days')) {
    const which = req.body.which;
    Result.find({ type: which }, (err, result) => {
      if (err) {
        logger.logThis(err, req);
        res.status(500).json({
          error: true,
          message: `ERROR: Problem fetching ${which} before being able to trim.`,
          code: err
        });
      } else if (result && result.length) {
        const cutoffDate = subDays(new Date(), req.body.days);
        const oldArr = result
          .filter(item => {
            const iDate = parse(item.date);
            return isBefore(iDate, cutoffDate);
          })
          .map(i => i._id);
        removeArr(oldArr)
          .then(rslt => {})
          .catch(error => {});
      } else {
        res.status(400).send({
          error: true,
          message: `WARNING: DB returned results for ${which} but results has no length.`
        });
      }
    });
  } else {
    res.status(400).json({
      error: true,
      message:
        "ERROR: Bad request; req either didn't have a body or the body was missing a parameter!"
    });
  }
};
