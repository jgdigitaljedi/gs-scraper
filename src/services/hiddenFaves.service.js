// import Storage from './storage.service';
import store from '../store';
import AppLogic from '../services/appLogic.service';
const axios = require('axios');

export default {
  trim(which, days) {
    return new Promise((resolve, reject) => {
      axios
        .post('http://localhost:3000/api/storage/trim', { which, days })
        .then(result => {
          console.log('trim result', result);
          resolve(result);
        })
        .catch(error => {
          console.warn('trim error', error);
          reject(error);
        });
    });
  },
  merge(which, all, current) {
    // use this for merge logic for hidden and faves
  },
  reset(which) {
    return new Promise((resolve, reject) => {
      const currResults = store.getters.allResults;
      AppLogic.clearAll(currResults, currResults.combinedListings, currResults.combinedSales, which)
        .then(results => {
          resolve(results.results, results.listings, results.sales);
        })
        .catch(err => {
          reject({ error: true, code: err, message: `ERROR: Problem resetting ${which}.` });
        });
    });
  }
};
