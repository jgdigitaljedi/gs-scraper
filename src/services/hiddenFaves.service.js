import store from '../store';
import AppLogic from '../services/appLogic.service';
const axios = require('axios');

export default {
  trim(which, days) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${process.env.VUE_APP_ROOT_URL}api/storage/trim`, { which, days })
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
  merge(which, newSet) {
    return new Promise((resolve, reject) => {
      axios
        .put(`${process.env.VUE_APP_ROOT_URL}api/storage/merge`, { which, newSet })
        .then(result => {
          console.log('merge result', result);
          resolve(result);
        })
        .catch(error => {
          console.warn('merge error', error);
          reject(error);
        });
    });
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
