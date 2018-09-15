// import Storage from './storage.service';
import store from '../store';
import AppLogic from '../services/appLogic.service';

export default {
  trim(which, num, results) {
    // use this to do trim logic for hidden and faves
  },
  merge(which, all, current) {
    // use this for merge logic for hidden and faves
  },
  reset(which) {
    return new Promise((resolve, reject) => {
      const currResults = store.getters.allResults;
      AppLogic.clearAll(currResults, currResults.combinedListings, currResults.combinedSales, which)
        .then(results => {
          console.log('hiddenFaves results', results);
          resolve(results.results, results.listings, results.sales);
        })
        .catch(err => {
          reject({ error: true, code: err, message: `ERROR: Problem resetting ${which}.` });
        });
    });
  }
};
