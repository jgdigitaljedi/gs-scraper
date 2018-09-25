import axios from 'axios';

export default {
  getOuData(search) {
    return axios
      .post(`${process.env.VUE_APP_ROOT_URL}api/offerup`, {
        area: search.area.ouArea,
        tags: search.tags,
        widen: search.widen
      })
      .then(response => {
        return response.data;
      })
      .catch(err => {
        return { error: true, err: err };
      });
  }
};
