const express = require('express');
const router = express.Router();
const format = require('date-fns/format');
const axios = require('axios');

function makeURIformat(arr) {
  return arr.map(tag => encodeURIComponent(tag.trim())).join();
}

function formatItem(item, index) {
  return {
    title: item.hasOwnProperty('name') ? item.name : 'NO TITLE',
    date: item.hasOwnProperty('updated_at')
      ? format(item['updated_at'][0], 'MM/DD/YYYY hh:mm a')
      : 'NO DATE',
    link:
      item.hasOwnProperty('image_information') &&
      item.hasOwnProperty('id') &&
      item.image_information
        ? `https://us.letgo.com/en/i/${item.image_information.trim()}_${item.id}`
        : null,
    description: item.hasOwnProperty('description') ? item.description : 'NO DESCRIPTION',
    image: item.hasOwnProperty('images') && item.images.length ? item.images[0].url : null,
    price: item.hasOwnProperty('price') ? item.price : 'NO PRICE',
    id: item.hasOwnProperty('id') ? item.id : index,
    key: item.hasOwnProperty('id') ? item.id : index,
    source: 'LetGo',
    type: 'listings'
  };
}

router.post('/', function(req, res) {
  const tagsURI = makeURIformat(req.body.tags);
  if (tagsURI && tagsURI.length) {
    // thankfully LetGo handles multiple tags in 1 search
    axios
      .get(
        `https://search-products-pwa.letgo.com/api/products?country_code=US&offset=0&search_term=${tagsURI}&quadkey=${
          req.body.area.lgKey
        }&sort=recent&num_results=32&distance_type=mi`,
        {
          headers: {
            Origin: 'https://us.letgo.com',
            Host: 'search-products-pwa.letgo.com',
            Referer: 'https://us.letgo.com'
          }
        }
      )
      .then(response => {
        if (response.data) {
          const cleanedArr = response.data.map((i, index) => formatItem(i, index));
          res.json({ error: false, payload: cleanedArr });
        } else {
          res.json({
            error: true,
            code: response,
            message: 'ERROR: Problem fetching LetGo results.'
          });
        }
      })
      .catch(err => {
        res.status(500).send({ letgoErr: err });
      });
  } else {
    res.status(400).json({ error: true, message: 'ERROR: Request may be malformed.' });
  }
});

module.exports = router;
