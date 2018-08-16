export default {
  sortByPrice(data) {
    return data.sort((a, b) => {
      const aPrice = a.hasOwnProperty('price') && a.price ? parseInt(a.price) : null;
      const bPrice = b.hasOwnProperty('price') && b.price ? parseInt(b.price) : null;
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
    });
  }
};
