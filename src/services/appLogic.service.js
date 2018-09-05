import Storage from './storage.service';

export default {
  clearAll: function (results, listings, sales, which) {
    return new Promise((resolve, reject) => {
      const clearMethod = which === 'hide' ? Storage.clearHidden : Storage.deleteAllFaves;
      clearMethod()
        .then(() => {
          let newResults = {};
          if (results) {
            const keys = Object.keys(results);
            keys.forEach(key => {
              if (key && results.hasOwnProperty(key) && results[key] && results[key].length) {
                newResults[key] = results[key].map(result => {
                  result[which] = false;
                  return result;
                });
              } else {
                newResults[key] = [];
              }
            });
          }
          const newListings =
            listings && Array.isArray(listings)
              ? [...listings].map(listing => {
                listing[which] = false;
                return listing;
              })
              : [];
          const newSales =
            sales && Array.isArray(sales)
              ? [...sales].map(sale => {
                sale[which] = false;
                return sale;
              })
              : [];
          resolve({
            results: newResults,
            listings: newListings,
            sales: newSales
          });
        })
        .catch(err => {
          console.error(err);
          reject(err);
        });
    });
  },
  adjustResultsForFaves(results, faves) {
    const favesIds = faves.map(item => item.id);
    const rCopy = [...results];
    return rCopy.map(result => {
      const isFave = favesIds.indexOf(result.id) >= 0;
      result.favorite = isFave;
      if (isFave) {
        result.hide = false;
      }
      return result;
    });
  }
};
