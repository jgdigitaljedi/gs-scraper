import Craigslist from './craiglist.service';
// import Letgo from './letgo.service';
import Offerup from './offerUp.service';
import store from '../store';
// import Storage from './storage.service';

let hidden;

function isHidden(result) {
  if (hidden) {
    return hidden.filter(i => i === result.id).length > 0;
  } else {
    return false;
  }
}

function getCl(search) {
  return Craigslist.get(search)
    .then(result => {
      if (!result) {
        return { error: false, message: `No Craigslist ${search.which} match your search!` };
      } else if (result.error) {
        return { error: true, message: `ERROR FECTHING CRAIGSLIST ${search.which.toUpperCase()}!` };
      } else {
        return result.map(o => {
          o.hide = isHidden(o);
          return o;
        });
      }
    })
    .catch(err => {
      console.warn('ERROR FETCHING CRAIGLIST LISTINGS!', err);
      return { error: true, message: 'ERROR FETCHING CRAIGLIST LISTINGS!' };
    });
}

export default {
  fetch(search) {
    // hidden = Storage.getHiddenCards();
    console.log('sotre', store);
    hidden = store.getters.hiddenIds;
    const cllPromise = this.cllPromise(search);
    const clsPromise = this.clsPromise(search);
    // const lglPromise = this.lglPromise(search);
    const ouPromise = this.ouPromise(search);

    return Promise.all([cllPromise, clsPromise, ouPromise]).then(result => {
      // result.forEach(r => {
      //   r.forEach(o => {
      //     o.hide = isHidden(o);
      //   });
      // });
      console.log('master result', result);
      const listingsIndexes = [0, 2, 3];
      const salesIndexes = [1];
      const validListings = listingsIndexes
        .map(item => {
          const r = result[item];
          return r && Array.isArray(r) ? r : null;
        })
        .filter(f => f);
      const validSales = salesIndexes
        .map(item => {
          const r = result[item];
          return r && Array.isArray(r) ? r : null;
        })
        .filter(f => f);
      return {
        cll: result[0],
        cls: result[1],
        // lgl: result[2],
        oul: result[2],
        combinedListings: [].concat.apply([], validListings),
        combinedSales: [].concat.apply([], validSales)
      };
    });
  },
  cllPromise(search) {
    if (search.cll) {
      search.which = 'listings';
      return getCl(search);
    } else {
      return Promise.resolve(null);
    }
  },
  clsPromise(search) {
    const sCopy = { ...search };
    if (sCopy.cls) {
      sCopy.which = 'garage sales';
      sCopy.tags = search.gs;
      return getCl(sCopy);
    } else {
      return Promise.resolve(null);
    }
  },
  // lglPromise(search) {
  //   if (search.lgl) {
  //     return Letgo.searchLetgo(search)
  //       .then(result => {
  //         if (!result) {
  //           return { error: false, message: 'No LetGo listings match your search!' };
  //         } else if (result.error) {
  //           return { error: true, message: 'ERROR FECTHING LETGO LISTINGS!' };
  //         } else {
  //           return result;
  //         }
  //       })
  //       .catch(err => {
  //         console.warn('ERROR FETCHING LETGO LISTINGS!', err);
  //         return { error: true, message: 'ERROR FETCHING LETGO LISTINGS!' };
  //       });
  //   } else {
  //     return Promise.resolve(null);
  //   }
  // },
  ouPromise(search) {
    if (search.oul) {
      return Offerup.getOuData(search)
        .then(result => {
          if (result && Array.isArray(result)) {
            return result.map(o => {
              o.hide = isHidden(o);
              return o;
            });
          }
          return result;
        })
        .catch(err => {
          console.log('ou error', err);
          return null;
        });
    }
  }
};
