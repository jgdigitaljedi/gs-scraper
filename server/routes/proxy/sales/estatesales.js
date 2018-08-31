const axios = require('axios');

function makeURIformat(arr) {
  // return arr.map(tag => encodeURIComponent(tag.trim())).join();
  return arr.map(tag => encodeURIComponent(tag.trim()));
}

module.exports.getEstateSales = function(request) {
  const query = makeURIformat(request.tags)[0];
  return new Promise((resolve, reject) => {
    const url = `https://www.estatesales.net/api/search-details?filter=byCombinedSearch:${query}|highlight|byDistance:${
      request.widen ? 50 : 30
    }|withOrigin:${
      request.area.estateBounds
    }|skip:0|take:24|withCountAggs&multiSelect=saleDetail:id,orgName,address,crimeWorriesAddress,cityName,stateCode, postalCodeNumber,name,type,mainPicture,topPictures,highlightedPictures,isLocallyFeatured,isRegionallyFeaturedThisWeek,isNationallyFeaturedThisWeek,firstLocalStartDate,lastLocalEndDate,dates|onlineItemDetail:id,cityName,stateCode,currentBidPrice,currentPrice,baseBuyNowPrice,currentBuyNowPrice,name,utcStartDate,utcEndDate,mainPicture,onlineItemPurchaseOptions,allowsShipping,allowsLocalPickup,numberOfBids&include=dates,mainPicture,topPictures,highlightedPictures,mainPicture,meta&aggsMetadata=true&explicitTypes=DateTime`;
    axios
      .get(url)
      .then(result => {
        if (result.data) {
          resolve(result.data);
        } else {
          reject();
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};
