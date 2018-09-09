import axios from 'axios';

export default {
  getLG(data) {
    if (data && data.hasOwnProperty('tags') && data.hasOwnProperty('area')) {
      return axios
        .post('http://localhost:3000/api/letgo', {
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
          console.warn('LetGo err', err);
          return { error: true, err: err };
        });
    }
  }
};
