const axios = require('axios');
const format = require('date-fns/format');
const _flattenDeep = require('lodash/flattenDeep');
const _uniqBy = require('lodash/uniqBy');

function makeURIformat(arr) {
  return arr.map(tag => encodeURIComponent(tag.trim()));
}

function makeRequest(request, tag) {
  return new Promise(resolve => {
    const url = `https://www.estatesales.net/api/search-details?filter=byCombinedSearch:${tag}|highlight|byDistance:${
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
          resolve({ error: true, code: result });
        }
      })
      .catch(err => {
        resolve({ error: true, code: err });
      });
  });
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

module.exports.getEstateSales = function (request, res) {
  const query = makeURIformat(request.tags);
  Promise.all(query.map(tag => makeRequest(request, tag)))
    .then(results => {
      if (!results || !results.length) {
        res.status(500).send({ error: true, code: results[0].code, message: 'ERROR: Problem getting Estate Sales results.' });
      } else {
        const errResults = results.map(r => r.error ? 1 : 0).reduce((a, b) => a + b, 0);
        if (errResults === results.length) {
          res.status(500).send({ error: true, code: results[0].code, message: 'ERROR: Problem getting Estate Sales results.' });
        } else {
          const cleaned = results.map(r => (r.error ? [] : r));
          const concatted = _uniqBy(_flattenDeep(cleaned), 'id');
          res.status(200).json({ error: false, payload: concatted });
        }
      }
    })
    .catch(err => {
      res.status(500).send({ error: true, code: err, message: 'ERROR: Problem getting Estate Sales results.' });
    });

};
