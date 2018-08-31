// const logger = require('../config/logger');
const mongoose = require('mongoose');
const Result = mongoose.model('Result');

module.exports.getResult = which => {
  return new Promise((resolve, reject) => {
    Result.find({}, function(err, result) {
      if (err) {
        reject({ error: true, message: 'ERROR: Error fetching hidden results list!', code: err });
      }
      if (result && result.length) {
        const hidden = result.filter(r => r.action === which);
        resolve({ error: false, payload: hidden });
      } else {
        resolve({ error: false, payload: [] });
      }
    });
  });
};

module.exports.addResult = (which, result) => {
  return new Promise((resolve, reject) => {
    let r = new Result();
    r.timestamp();
    r.action = which;
    r.date = result.date || null;
    r.price = result.price || null;
    r.title = result.title || null;
    r.link = result.link || null;
    r.image = result.image || null;
    r.description = result.description || null;
    r.source = result.source;
    r.id = result.id;
    r.key = result.key || null;
    r.type = result.type;

    r.save(err => {
      if (err) {
        reject({ error: true, message: `ERROR: Problem saving new ${which}.`, code: err });
      } else {
        resolve({ error: false, message: `Your ${which} was successfully saved!` });
      }
    });
  });
};

module.exports.deleteResult = (which, result) => {
  return new Promise((resolve, reject) => {
    Result.find({ action: which }, (err, r) => {
      if (err) {
        reject({ error: true, code: err, message: `ERROR: Problem fetching ${which}s.` });
      } else {
        if (!Array.isArray(r)) r = [r];
        const chosen = r.filter(item => item.id === result.id && item.source === result.source);
        const remaining = r.filter(item => item.id !== result.id);
        if (chosen && chosen.length === 1) {
          r.remove(e => {
            if (e) {
              reject({
                error: true,
                code: e,
                message: `ERROR: Problem deleting the request ${which}!`
              });
            } else {
              resolve({
                error: false,
                message: `Successfully deleted the selected ${which}!`,
                payload: remaining
              });
            }
          });
        } else {
          reject({
            error: true,
            code: 'NOT FOUND',
            message: `ERROR: could not find ${which} with matching source and id!`
          });
        }
      }
    });
  });
};

module.exports.deleteAll = which => {
  return new Promise((resolve, reject) => {
    Result.remove({ action: which }, (err, result) => {
      if (err) {
        reject({ error: true, message: `ERROR: Problem deleting all ${which}!`, code: err });
      } else {
        resolve({
          error: false,
          message: `All ${which} were successfully deleted!`,
          payload: result
        });
      }
    });
  });
};
