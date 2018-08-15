import axios from 'axios';

export default {
  getOuData(search) {
    console.log('search', search);
    return axios
      .post(`http://localhost:3000/api/offerup`, {
        area: search.area.name,
        tags: search.tags
      })
      .then(response => {
        console.log('ou response', response);
        return response.data;
      })
      .catch(err => {
        console.log('ou err', err);
      });
  }
};
