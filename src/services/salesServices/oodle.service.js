import axios from 'axios';

export default {
  get(data) {
    if (data && data.hasOwnProperty('gs') && data.hasOwnProperty('area')) {
      return axios
        .post('http://localhost:3000/api/oodle', {
          area: data.area,
          tags: data.tags,
          widen: data.widen
        })
        .then(result => {
          if (result.data && result.data.payload) {
            return result.data.payload;
          } else {
            return null;
          }
        })
        .catch(err => {
          console.warn('oodle err', err);
          return { error: true, err: err };
        });
    }
  }
};
