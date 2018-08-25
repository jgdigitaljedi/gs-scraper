const offerUp = require('offerup');
const express = require('express');
const router = express.Router();
const format = require('date-fns/format');
const _flattenDeep = require('lodash/flattenDeep');
const _uniqBy = require('lodash/uniqBy');

function cleanItem(item) {
  return {
    key: item.hasOwnProperty('id') ? item.id : Math.floor(Math.random() * 33333),
    id: item.hasOwnProperty('id') ? item.id : Math.floor(Math.random() * 33333),
    description: item.hasOwnProperty('description') ? item.description : '',
    date: item.hasOwnProperty('post_date') ? format(item.post_date, 'MM/DD/YYYY hh:mm a') : '',
    title: item.hasOwnProperty('title') ? item.title : '',
    price: item.hasOwnProperty('price') ? item.price.split('.')[0] : '',
    image: item.hasOwnProperty('image_mob_det_hd') ? item.image_mob_det_hd : null,
    link: item.hasOwnProperty('get_full_url') ? item.get_full_url : null,
    source: 'OfferUp'
  };
}

function makeRequest({ area, widen }, tag) {
  return new Promise(resolve => {
    offerUp
      .getFullListByQuery({
        location: area, // required
        search: tag, // required
        radius: widen ? 50 : 30,
        limit: widen ? 50 : 30,
        price_min: 0,
        price_max: 1000
      })
      .then(
        function success(response) {
          if (response && Array.isArray(response) && response.length) {
            // res.status(200).send(response.map(i => cleanItem(i)));
            resolve(response.map(i => cleanItem(i)));
          } else {
            // res.status(500).send({ error: true, message: response });
            resolve({ error: true, message: response });
          }
        },
        function error() {
          // res.status(500).send(err);
          resolve({ error: true, message: 'ERROR FETCHING OFFERUP RESULTS!' });
        }
      );
  });
}

router.post('/', function(req, res) {
  if (
    req.body.hasOwnProperty('area') &&
    req.body.area &&
    req.body.hasOwnProperty('tags') &&
    req.body.tags
  ) {
    const promiseArr = req.body.tags.map(tag => makeRequest(req.body, tag));
    Promise.all(promiseArr).then(results => {
      const errors = [];
      const validResults = results.filter(result => {
        if (result && !Array.isArray(result) && result.error) {
          errors.push(result);
        }
        return result && Array.isArray(result) && result.length;
      });
      if (validResults && Array.isArray(validResults) && validResults.length) {
        // res.send(_uniqBy(_flattenDeep(validResults), 'id'));
        res.send(validResults);
      } else if (results && results.length === errors.length) {
        res.status(500).send({
          error: true,
          message: 'ERROR FETCHING OFFERUP RESULTS!'
        });
      } else {
        res.send(200).send(null);
      }
    });
  } else {
    res.status(400).send({ error: true, message: 'Bad request to OfferUp' });
  }
});

module.exports = router;
