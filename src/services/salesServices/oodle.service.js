import axios from 'axios';

export default {
  get(data) {
    if (data && data.hasOwnProperty('tags') && data.hasOwnProperty('area')) {
      return axios
        .post(`${process.env.VUE_APP_ROOT_URL}api/oodle`, {
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
