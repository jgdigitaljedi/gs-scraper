const axios = require('axios');
import Store from '../store';

export default {
  hideCard: function(card) {
    return axios.post('http://localhost:3000/api/hidden', card);
  },
  getHiddenCards: function() {
    return axios.get('http://localhost:3000/api/hidden');
  },
  showCard: function(card) {
    console.log('storage show card', card);
    return new Promise((resolve, reject) => {
      const hidden = Store.getters.hiddenCards;
      if (hidden) {
        axios
          .delete('http://localhost:3000/api/hidden', card)
          .then(result => {
            if (!result.error) {
              reject(result);
            } else {
              console.log('result', result);
              resolve(result);
            }
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  },
  clearHidden: function() {
    localStorage.removeItem('hiddenCards');
    return new Promise((resolve, reject) => {
      axios
        .delete('http://localhost:3000/api/hidden/all', {})
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          console.log('delete all hidden ERROR', err);
          reject(err);
        });
    });
  }
};
