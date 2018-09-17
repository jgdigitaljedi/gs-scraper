const logger = require('../config/logger');
const mongoose = require('mongoose');
const Result = mongoose.model('Result');
const parse = require('date-fns/parse');
const subDays = require('date-fns/sub_days');
const isBefore = require('date-fns/is_before');

function removeArr(arr) {
  return Result.remove({ _id: { $in: arr.map(mongoose.Types.ObjectId) } });
}

function badRequest(res) {
  res.status(400).json({
    error: true,
    message:
      "ERROR: Bad request; req either didn't have required body arguments or was missing a URL parameter!"
  });
}

module.exports.trimHF = function (req, res) {
  if (req && req.body && req.body.hasOwnProperty('which') && req.body.hasOwnProperty('days')) {
    const which = req.body.which;
    Result.find({ action: which }, (err, result) => {
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
          .then(rslt => {
            res.json({ error: false, numberRemoved: rslt.n, results: result.filter(r => oldArr.indexOf(r._id) < 0) });
          })
          .catch(error => {
            logger.logThis(error, req);
            res.status(500).json({ error: true, code: error, message: `ERROR: Problem removing ${which} older than ${req.body.days} days.` });
          });
      } else {
        res.status(400).send({
          error: true,
          message: `WARNING: DB returned results for ${which} but results has no length.`
        });
      }
    });
  } else {
    badRequest(res);
  }
};

module.exports.getHF = function (req, res) {
  if (req.params && req.params.hasOwnProperty('which')) {
    const which = req.params.which;
    Result.find({ action: which }, function (err, result) {
      if (err) {
        logger.logThis(err, req);
        res.status(500).json({ error: true, message: `ERROR: Error fetching ${which} results list!`, code: err });
      } else {
        res.status(200).json({ error: false, payload: result });
      }
    });
  } else {
    badRequest(res);
  }
};

module.exports.deleteAll = function (req, res) {
  if (req.params && req.params.hasOwnProperty('which')) {
    const which = req.params.which;
    Result.remove({ action: which }, (err, result) => {
      if (err) {
        res.status(500).json({ error: true, message: `ERROR: Problem deleting all ${which}!`, code: err });
      } else {
        res.status(200).json({
          error: false,
          message: `All ${which} were successfully deleted!`,
          payload: result
        });
      }
    });
  } else {
    badRequest(res);
  }
};

module.exports.saveHF = function (req, res) {
  if (req.body && req.body.hasOwnProperty('id') && req.body.hasOwnProperty('action')) {
    const which = req.body.action;
    const newResult = req.body;
    let r = new Result();
    r.timestamp();
    r.action = which;
    r.date = newResult.date || null;
    r.price = newResult.price || null;
    r.title = newResult.title || null;
    r.link = newResult.link || null;
    r.image = newResult.image || null;
    r.description = newResult.description || null;
    r.source = newResult.source;
    r.id = newResult.id;
    r.key = newResult.key || null;
    r.type = newResult.type;

    r.save(err => {
      if (err) {
        logger.logThis(err, req);
        res.status(500).json({ error: true, message: `ERROR: Problem saving new ${which}.`, code: err });
      } else {
        Result.find({ action: which }, (error, result) => {
          if (err) {
            res.status(503).json({
              error: false,
              message: `Your ${which} was saved, but there was a problem fetching all.`,
              code: error
            });
          } else {
            res.status(200).json({
              error: false,
              message: `Your ${which} was successfully saved!`,
              payload: result
            });
          }
        });
      }
    });
  } else {
    badRequest(res);
  }
};
