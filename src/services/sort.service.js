import compareAsc from 'date-fns/compare_asc';
import compareDesc from 'date-fns/compare_desc';

export default {
  sortByPrice(data) {
    const dataWithPrices = [...data].filter(i => i.hasOwnProperty('price') && i.price);
    const dataNoPrices = [...data].filter(i => !i.hasOwnProperty('price') || !i.price);
    return dataWithPrices
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
  }
  // sortByRel(data) {}
};
