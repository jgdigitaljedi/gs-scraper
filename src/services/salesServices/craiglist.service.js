import axios from 'axios';

export default {
  get(data) {
    if (data && data.hasOwnProperty('tags') && data.hasOwnProperty('area')) {
      return axios
        .post(`${process.env.VUE_APP_ROOT_URL}api/cl`, {
          area: data.area,
          tags: data.tags,
          which: data.which,
          widen: data.widen
        })
        .then(result => {
          if (result.data) {
            return result.data;
          } else {
            return null;
          }
        })
        .catch(err => {
          console.log('cl err', err);
          return { error: true, err: err };
        });
    }
  }
};
