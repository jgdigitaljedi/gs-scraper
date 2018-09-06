const axios = require('axios');
const format = require('date-fns/format');

function makeURIformat(arr) {
  return arr.map(tag => encodeURIComponent(tag.trim()));
}

function formatData(data, key) {
  return {
    id: data.id,
    title: data.orgName || '',
    date: data.hasOwnProperty('firstLocalStartDate') && data.firstLocalStartDate.hasOwnProperty('_value')
      ? format(data.firstLocalStartDate._value, 'MM/DD/YYYY hh:mm a')
      : 'NO  DATE',
    description: data.name || '',
    type: 'garage sales',
    source: 'EstateSales',
    key: key,
    price: null,
    image: data.mainPicture.thumbnailUrl,
    link: `https://www.estatesales.net/${data.stateCode}/${data.cityName}/${data.postalCodeNumber}/${data.id}`
  };
}

module.exports.getEstateSales = function (request) {
  // @TODO: make this handle multiple tags with multiple requests
  const query = makeURIformat(request.tags)[0];
  console.log('query', query);
  return new Promise((resolve, reject) => {
    const url = `https://www.estatesales.net/api/search-details?filter=byCombinedSearch:${query}|highlight|byDistance:${
      request.widen ? 50 : 30
      }|withOrigin:${
      request.area.estateBounds
      }|skip:0|take:24|withCountAggs&multiSelect=saleDetail:id,orgName,address,crimeWorriesAddress,cityName,stateCode, postalCodeNumber,name,type,mainPicture,topPictures,highlightedPictures,isLocallyFeatured,isRegionallyFeaturedThisWeek,isNationallyFeaturedThisWeek,firstLocalStartDate,lastLocalEndDate,dates|onlineItemDetail:id,cityName,stateCode,currentBidPrice,currentPrice,baseBuyNowPrice,currentBuyNowPrice,name,utcStartDate,utcEndDate,mainPicture,onlineItemPurchaseOptions,allowsShipping,allowsLocalPickup,numberOfBids&include=dates,mainPicture,topPictures,highlightedPictures,mainPicture,meta&aggsMetadata=true&explicitTypes=DateTime`;
    axios
      .get(url)
      .then(result => {
        if (result.data && result.data.items) {
          const cleaned = result.data.items.map((item, index) => {
            return formatData(item, index + 4000);
          });
          resolve(cleaned);
        } else {
          reject();
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};
