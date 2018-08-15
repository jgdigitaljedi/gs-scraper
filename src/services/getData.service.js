import Craigslist from './craiglist.service';
import Letgo from './letgo.service';
import Offerup from './offerUp.service';

export default {
  fetch(search) {
    const cllPromise = this.cllPromise(search);
    const clsPromise = this.clsPromise(search);
    const lglPromise = this.lglPromise(search);
    const ouPromise = this.ouPromise(search);

    return Promise.all([cllPromise, clsPromise, lglPromise, ouPromise]).then(result => {
      return {
        cll: result[0],
        cls: result[1],
        lgl: result[2],
        oul: result[3]
      };
    });
  },
  cllPromise(search) {
    if (search.cll) {
      return Craigslist.get(search)
        .then(result => {
          if (!result) {
            return { error: false, message: 'No Craigslist listings match your search!' };
          } else if (result.error) {
            return { error: true, message: 'ERROR FECTHING CRAIGSLIST LISTINGS!' };
          } else {
            return result;
          }
        })
        .catch(err => {
          console.warn('ERROR FETCHING CRAIGLIST LISTINGS!', err);
          return { error: true, message: 'ERROR FETCHING CRAIGLIST LISTINGS!' };
        });
    } else {
      return Promise.resolve(null);
    }
  },
  clsPromise(search) {
    if (search.cls) {
      return Craigslist.getGarageSales(search)
        .then(result => {
          if (!result) {
            return { error: false, message: 'No Craigslist garage sales match your search!' };
          } else if (result.error) {
            return { error: true, message: 'ERROR FECTHING CRAIGSLIST GARAGE SALES!' };
          } else {
            return result;
          }
        })
        .catch(err => {
          console.warn('ERROR FETCHING CRAIGLIST GARAGE SALES!', err);
          return {
            error: true,
            message: 'ERROR FETCHING CRAIGLIST GARAGE SALES!'
          };
        });
    } else {
      return Promise.resolve(null);
    }
  },
  lglPromise(search) {
    if (search.lgl) {
      return Letgo.searchLetgo(search)
        .then(result => {
          if (!result) {
            return { error: false, message: 'No LetGo listings match your search!' };
          } else if (result.error) {
            return { error: true, message: 'ERROR FECTHING LETGO LISTINGS!' };
          } else {
            return result;
          }
        })
        .catch(err => {
          console.warn('ERROR FETCHING LETGO LISTINGS!', err);
          return { error: true, message: 'ERROR FETCHING LETGO LISTINGS!' };
        });
    } else {
      return Promise.resolve(null);
    }
  },
  ouPromise(search) {
    console.log('in ou promise');
    if (search.oul) {
      return Offerup.getOuData(search)
        .then(result => {
          console.log('ou result', result);
          return result;
        })
        .catch(err => {
          console.log('ou error', err);
          return null;
        });
    }
  }
};
