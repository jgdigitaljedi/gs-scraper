import * as Offerup from 'offerup';

export default {
  getOuData(search) {
    return Offerup.getFullListByQuery({
      location: search.name, // required
      search: search.tags.join(','), // required
      radius: 30,
      limit: 30,
      price_min: 0,
      price_max: 1000
    }).then(
      function success(response) {
        return new Promise(resolve => {
          if (response) {
            resolve(response.map(i => this.cleanOuItem(i)));
          } else {
            resolve(null);
          }
        });
      },
      function error(err) {
        return Promise.resolve({
          error: true,
          message: 'THERE WS AN ERROR FETCHING OFFERUP RESULTS!',
          err: err
        });
      }
    );
  },
  cleanOuItem(item) {
    return {
      key: item.id,
      description: item.description,
      title: item.title,
      date: item.post_date_ago,
      link: item.get_full_url,
      price: 0
    };
  }
};
