const logger = require('../config/logger');
const rCtrl = require('./result.controller');

module.exports.getHidden = (req, res) => {
  rCtrl
    .getResult('hidden')
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      logger.logThis(err.code, req);
      res.status(500).json(err);
    });
};

module.exports.saveHidden = (req, res) => {
  if (req.body && req.body.hasOwnProperty('id') && req.body.hasOwnProperty('source')) {
    rCtrl
      .addResult('hidden', req.body)
      .then(() => {
        rCtrl
          .getResult('hidden')
          .then(result => {
            result.message = 'Your result was successfully added to hidden!';
            res.status(200).json(result);
          })
          .catch(err => {
            logger.logThis(err.code, req);
            err.message =
              'ERROR: Result was hidden, but error encountered trying to fetch hidden array to return!';
            res.status(500).json(err);
          });
        // res.status(200).json(result);
      })
      .catch(err => {
        logger.logThis(err.code, req);
        res.status(500).json(err);
      });
  } else {
    res
      .status(400)
      .json({
        error: true,
        message:
          "ERROR: bad request; req either didn't have a body or the body was missing id or source!"
      });
  }
};

module.exports.deleteHidden = (req, res) => {
  if (req.body && req.body.hasOwnProperty('id') && req.body.hasOwnProperty('source')) {
    rCtrl
      .deleteResult('hidden', req.body)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => {
        logger.logThis(err.code, req);
        res.status(500).json(err);
      });
  } else {
    res
      .status(400)
      .json({
        error: true,
        message:
          "ERROR: bad request; req either didn't have a body or the body was missing id or source!"
      });
  }
};

module.exports.deleteAll = (req, res) => {
  rCtrl
    .deleteAll('hidden')
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      logger.logThis(err.code, req);
      res.status(500).json(err);
    });
};
