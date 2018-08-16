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
  }
};
