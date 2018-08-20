import compareAsc from 'date-fns/compare_asc';
import compareDesc from 'date-fns/compare_desc';
import * as _sortBy from 'lodash/sortBy';
import * as _sum from 'lodash/sum';

export default {
  sortByPrice(data, tags, rev) {
    const dataWithPrices = [...data].filter(i => i.hasOwnProperty('price') && i.price);
    const dataNoPrices = [...data].filter(i => !i.hasOwnProperty('price') || !i.price);
    const sorted = dataWithPrices
      .sort((a, b) => {
        const aPrice = parseInt(a.price);
        const bPrice = parseInt(b.price);
        if (aPrice && bPrice) {
          if (aPrice < bPrice) {
            return -1;
          }
          if (aPrice > bPrice) {
            return 1;
          }
          return 0;
        }
        return 1;
      })
      .concat(dataNoPrices);
    if (rev) {
      return sorted.reverse();
    } else {
      return sorted;
    }
  },
  sortByDateAsc(data) {
    return data.sort((a, b) => {
      return compareAsc(a.date, b.date);
    });
  },
  sortByDateDesc(data) {
    return data.sort((a, b) => {
      return compareDesc(a.date, b.date);
    });
  },
  sortByRel(data, tags) {
    if (tags && Array.isArray(tags) && tags.length) {
      const dataCopy = [...data];
      const scored = dataCopy.map(item => {
        item.score = _sum(
          tags.map(tag => {
            const titleDesc = `${item.title} ${item.description}`;
            const count = titleDesc.toLowerCase().split(tag.toLowerCase()).length - 1;
            return count;
          })
        );
        return item;
      });
      return _sortBy(scored, 'score').reverse();
    } else {
      return data;
    }
  }
};
