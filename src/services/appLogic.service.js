export default {
  clearAllHides: function(results, listings, sales) {
    return new Promise(resolve => {
      let noHides = {};
      if (results) {
        const keys = Object.keys(results);
        keys.forEach(key => {
          if (key && results.hasOwnProperty(key) && results[key] && results[key].length) {
            noHides[key] = results[key].map(result => {
              result.hide = false;
              return result;
            });
          } else {
            noHides[key] = [];
          }
        });
      }
      const newListings =
        listings && Array.isArray(listings)
          ? [...listings].map(listing => {
              listing.hide = false;
              return listing;
            })
          : [];
      const newSales =
        sales && Array.isArray(sales)
          ? [...sales].map(sale => {
              sale.hide = false;
              return sale;
            })
          : [];
      resolve({
        results: noHides,
        listings: newListings,
        sales: newSales
      });
    });
  }
};
