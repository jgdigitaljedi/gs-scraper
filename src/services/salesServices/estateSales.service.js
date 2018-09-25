import axios from 'axios';

export default {
  get(data) {
    if (data && data.hasOwnProperty('gs') && data.hasOwnProperty('area')) {
      return axios
        .post(`${process.env.VUE_APP_ROOT_URL}api/garagesales/estatesales`, {
          area: data.area,
          tags: data.gs,
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
          console.error('estateSales err', err);
          return { error: true, err: err };
        });
    }
  }
}