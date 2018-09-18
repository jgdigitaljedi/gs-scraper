const axios = require('axios');
import Store from '../store';

export default {
  hideCard: function (card) {
    return axios.post('http://localhost:3000/api/storage', { card, which: 'hidden' });
  },
  getHiddenCards: function () {
    return axios.get('http://localhost:3000/api/hidden');
  },
  showCard: function (card) {
    console.log('storage show card', card);
    return new Promise((resolve, reject) => {
      const hidden = Store.getters.hiddenCards;
      if (hidden) {
        axios
          .post('http://localhost:3000/api/hidden/delete', card)
          .then(result => {
            if (result.data.error) {
              reject(result);
            } else {
              resolve(result);
            }
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  },
  clearHidden: function () {
    // localStorage.removeItem('hiddenCards');
    return new Promise((resolve, reject) => {
      axios
        .delete('http://localhost:3000/api/hidden', {})
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          console.log('delete all hidden ERROR', err);
          reject(err);
        });
    });
  },
  saveFave: function (card) {
    return axios.post('http://localhost:3000/api/storage', { card, which: 'fave' });
  },
  getFaveCards: function () {
    return axios.get('http://localhost:3000/api/faves');
  },
  removeFave: function (card) {
    return new Promise((resolve, reject) => {
      const hidden = Store.getters.hiddenCards;
      if (hidden) {
        axios
          .post('http://localhost:3000/api/faves/delete', card)
          .then(result => {
            if (result.data.error) {
              reject(result);
            } else {
              resolve(result);
            }
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  },
  deleteAllFaves() {
    return new Promise((resolve, reject) => {
      axios
        .delete('http://localhost:3000/api/faves', {})
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          console.log('delete all fave ERROR', err);
          reject(err);
        });
    });
  }
};
