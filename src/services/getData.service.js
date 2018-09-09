import Craigslist from './salesServices/craiglist.service';
import Letgo from './salesServices/letgo.service';
import Offerup from './salesServices/offerUp.service';
import store from '../store';
import EstateSales from './salesServices/estateSales.service';
import Oodle from './salesServices/oodle.service';
import Varage from './salesServices/varageSale.service';

let hidden, faves;

function isHidden(result) {
  if (hidden) {
    return hidden.filter(i => i === result.id).length > 0;
  } else {
    return false;
  }
}

function isFave(result) {
  if (faves) {
    return faves.filter(i => i === result.id).length > 0;
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
        return result.filter(r => r).map(o => {
          o.hide = isHidden(o);
          o.favorite = isFave(o);
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
    hidden = store.getters.hiddenIds;
    faves = store.getters.faveIds;
    const cllPromise = this.cllPromise(search);
    const clsPromise = this.clsPromise(search);
    const lglPromise = this.lglPromise(search);
    const ouPromise = this.ouPromise(search);
    const esPromise = this.esPromise(search);
    const oodPromise = this.oodlePromise(search);
    const varPromise = this.varagePromise(search);

    return Promise.all([
      cllPromise,
      clsPromise,
      ouPromise,
      esPromise,
      oodPromise,
      varPromise,
      lglPromise
    ]).then(result => {
      const listingsIndexes = [0, 2, 4, 5, 6];
      const salesIndexes = [1, 3];
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
        lgl: result[6],
        oul: result[2],
        ess: result[3],
        ood: result[4],
        vsl: result[5],
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
  lglPromise(search) {
    if (search.lgl) {
      return Letgo.getLG(search)
        .then(result => {
          if (result && Array.isArray(result)) {
            return result.map(o => {
              o.hide = isHidden(o);
              o.favorite = isFave(o);
              return o;
            });
          }
          return result;
        })
        .catch(err => {
          console.log('lg error', err);
          return null;
        });
    } else {
      return Promise.resolve(null);
    }
  },
  ouPromise(search) {
    if (search.oul) {
      return Offerup.getOuData(search)
        .then(result => {
          if (result && Array.isArray(result)) {
            return result.map(o => {
              o.hide = isHidden(o);
              o.favorite = isFave(o);
              return o;
            });
          }
          return result;
        })
        .catch(err => {
          console.log('ou error', err);
          return null;
        });
    } else {
      return Promise.resolve(null);
    }
  },
  esPromise(search) {
    if (search.ess) {
      return EstateSales.get(search)
        .then(result => {
          if (result && Array.isArray(result)) {
            return result.map(o => {
              o.hide = isHidden(o);
              o.favorite = isFave(o);
              return o;
            });
          }
          return result;
        })
        .catch(err => {
          console.warn('estate  sales err', err);
          return null;
        });
    } else {
      return Promise.resolve(null);
    }
  },
  oodlePromise(search) {
    if (search.ood) {
      return Oodle.get(search)
        .then(result => {
          if (result && Array.isArray(result)) {
            return result.map(o => {
              o.hide = isHidden(o);
              o.favorite = isFave(o);
              return o;
            });
          }
          return result;
        })
        .catch(err => {
          console.warn('Oodle err', err);
          return null;
        });
    } else {
      return Promise.resolve(null);
    }
  },
  varagePromise(search) {
    if (search.vsl) {
      return Varage.get(search)
        .then(result => {
          if (result && Array.isArray(result)) {
            return result.map(o => {
              o.hide = isHidden(o);
              o.favorite = isFave(o);
              return o;
            });
          }
          return result;
        })
        .catch(err => {
          console.warn('VarageSale err', err);
          return null;
        });
    } else {
      return Promise.resolve(null);
    }
  }
};
