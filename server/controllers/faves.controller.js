const logger = require('../config/logger');
const rCtrl = require('./result.controller');

module.exports.getFaves = (req, res) => {
  rCtrl
    .getResult('fave')
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      logger.logThis(err.code, req);
      res.status(500).json(err);
    });
};

module.exports.saveFave = (req, res) => {
  if (req.body && req.body.hasOwnProperty('id') && req.body.hasOwnProperty('source')) {
    rCtrl
      .addResult('fave', req.body)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => {
        logger.logThis(err.code, req);
        res.status(500).json(err);
      });
  } else {
    res.status(400).json({
      error: true,
      message:
        "ERROR: bad request; request either didn't have a body or the body was missing id or source!"
    });
  }
};

module.exports.deleteFave = (req, res) => {
  if (req.body && req.body.hasOwnProperty('id') && req.body.hasOwnProperty('source')) {
    rCtrl
      .deleteResult('fave', req.body)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => {
        logger.logThis(err.code, req);
        res.status(500).json(err);
      });
  } else {
    res.status(400).json({
      error: true,
      message:
        "ERROR: bad request; req either didn't have a body or the body was missing id or source!",
      request: req.body
    });
  }
};

module.exports.deleteAllFaves = (req, res) => {
  rCtrl
    .deleteAll('fave')
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      logger.logThis(err.code, req);
      res.status(500).json(err);
    });
};
