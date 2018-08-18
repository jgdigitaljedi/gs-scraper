const offerUp = require('offerup');
const express = require('express');
const router = express.Router();
const format = require('date-fns/format');

function cleanItem(item) {
  return {
    key: item.hasOwnProperty('id') ? item.id : Math.floor(Math.random() * 3333),
    description: item.hasOwnProperty('description') ? item.description : '',
    date: item.hasOwnProperty('post_date') ? format(item.post_date, 'MM/DD/YYYY hh:mm a') : '',
    title: item.hasOwnProperty('title') ? item.title : '',
    price: item.hasOwnProperty('price') ? item.price.split('.')[0] : '',
    image: item.hasOwnProperty('image_mob_det_hd') ? item.image_mob_det_hd : null,
    link: item.hasOwnProperty('get_full_url') ? item.get_full_url : null,
    source: 'OfferUp'
  };
}

router.post('/', function(req, res) {
  console.log('req', req.body);
  if (
    req.body.hasOwnProperty('area') &&
    req.body.area &&
    req.body.hasOwnProperty('tags') &&
    req.body.tags
  ) {
    offerUp
      .getFullListByQuery({
        location: req.body.area, // required
        search: req.body.tags.join(','), // required
        radius: 30,
        limit: 30,
        price_min: 0,
        price_max: 1000
      })
      .then(
        function success(response) {
          if (response && Array.isArray(response) && response.length) {
            res.status(200).send(response.map(i => cleanItem(i)));
          } else {
            res.status(500).send({ error: true, message: response });
          }
        },
        function error(err) {
          res.status(500).send(err);
        }
      );
  } else {
    res.status(400).send({ error: true, message: 'Bad request to OfferUp' });
  }
});

module.exports = router;
