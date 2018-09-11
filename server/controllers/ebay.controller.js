const logger = require('../config/logger');
const axios = require('axios');

function makeEbaySearchFormat(str) {
  return str.split(' ').join('+');
}

module.exports.getEbayPrices = function (req, res) {
  if (req && req.body && req.body && req.body.query) {
    const searchTerms = makeEbaySearchFormat(req.body.query);
    const url = `http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findCompletedItems&SERVICE-VERSION=1.11.0&SECURITY-APPNAME=${process.env.EBAYCLIENTID}&RESPONSE-DATA-FORMAT=JSON&keywords=${searchTerms}&itemFilter(0).name=Condition&itemFilter(0).value=3000&itemFilter(0).value=4000&itemFilter(0).value=5000&itemFilter(0).value=6000&itemFilter(1).name=SoldItemsOnly&itemFilter(1).value=true&itemFilter(2).name=ListingType&itemFilter(2).value(0)=AuctionWithBIN&itemFilter(2).value(1)=FixedPrice&itemFilter(2).value(2)=StoreInventory&itemFilter(3).name=MinPrice&itemFilter(3).value=1.0&itemFilter(4).name=Currency&itemFilter(4).value=USD`;
    axios
      .get(url)
      .then(result => {
        if (result && result.data && result.data.findCompletedItemsResponse) {
          const prices = result.data.findCompletedItemsResponse[0].searchResult[0].item
            .map(i => i.sellingStatus[0].currentPrice[0].__value__)
            .filter(i => i)
            .map(p => parseFloat(p))
            .sort((a, b) => {
              const aParsed = parseFloat(a);
              const bParsed = parseFloat(b);
              if (aParsed < bParsed) {
                return -1;
              }
              if (bParsed < aParsed) {
                return 1;
              }
              return 0;
            });
          const pLen = prices.length;
          const highest = prices[pLen - 1];
          const lowest = prices[0];
          const average = Math.round((prices.reduce((a, b) => a + b, 0)) / pLen);
          // https://www.ebay.com/sch/i.html?_nkw=power+stone+2 // example of how to use searchTerms in client to open page on ebay
          res.status(200).json({ error: false, payload: { highest, lowest, average, results: pLen, searchTerms } });
        } else {
          res.status(500).json({ error: true, message: 'ERROR: Ebay price results fetched; error while parsing results' });
        }
      })
      .catch(err => {
        logger.logThis(req, err);
        res.status(500).json({ error: true, message: 'ERROR: Problem fetching eBay price results.', code: err });
      });
  } else {
    res.status(400).json({ error: true, message: 'ERROR: Request malformed/doesn\'t contain required arguments.' });
  }
};