import axios from 'axios';

export default {
  get(data) {
    if (data && data.hasOwnProperty('gs') && data.hasOwnProperty('area')) {
      return axios
        .post('http://localhost:3000/api/varage', {
          area: data.area,
          tags: data.tags
        })
        .then(result => {
          if (result.data && result.data.payload) {
            return result.data.payload;
          } else {
            return null;
          }
        })
        .catch(err => {
          console.warn('varage err', err);
          return { error: true, err: err };
        });
    }
  }
};