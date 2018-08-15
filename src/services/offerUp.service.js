import axios from 'axios';

export default {
  getOuData(search) {
    return axios
      .post(`http://localhost:3000/api/offerup`, {
        area: search.area.name,
        tags: search.tags
      })
      .then(response => {
        return response.data;
      })
      .catch(err => {
        return { error: true, err: err };
      });
  }
};
