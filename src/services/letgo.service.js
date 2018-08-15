import axios from 'axios';
import { format } from 'date-fns';

export default {
  searchLetgo(search) {
    return axios
      .get(
        `https://search-products-pwa.letgo.com/api/products?country_code=US&offset=0&search_term=${
          search.tags
        }&quadkey=${search.area.lgKey}&sort=recent&num_results=32&distance_type=mi`
      )
      .then(result => {
        return new Promise(resolve => {
          if (result && result.hasOwnProperty('data') && result.data && result.data.length) {
            const cleanedArr = result.data.map((i, index) => this.formatItem(i, index));
            resolve(cleanedArr);
          } else {
            resolve(null);
          }
        });
      })
      .catch(err => {
        console.warn('ERROR WITH LETGO:', err);
        return { error: true, message: err };
      });
  },
  formatItem(item, index) {
    return {
      title: item.hasOwnProperty('name') ? item.name : 'NO TITLE',
      date: item.hasOwnProperty('updated_at')
        ? format(item['updated_at'][0], 'MM/DD/YYYY hh:mm a')
        : 'NO DATE',
      link:
        item.hasOwnProperty('image_information') &&
        item.hasOwnProperty('id') &&
        item.image_information
          ? `https://us.letgo.com/en/i/${item.image_information.trim()}_${item.id}`
          : null,
      description: item.hasOwnProperty('description') ? item.description : 'NO DESCRIPTION',
      image: item.hasOwnProperty('images') && item.images.length ? item.images[0].url : null,
      price: item.hasOwnProperty('price') ? item.price : 'NO PRICE',
      key: index
    };
  }
};
