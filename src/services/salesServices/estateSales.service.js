import axios from 'axios';

export default {
  get(data) {
    if (data && data.hasOwnProperty('gs') && data.hasOwnProperty('area')) {
      return axios
        .post('http://localhost:3000/api/garagesales/estatesales', {
          area: data.area,
          tags: data.gs,
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
          console.error('estateSales err', err);
          return { error: true, err: err };
        });
    }
  }
}