const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
const router = express.Router();
const _flattenDeep = require('lodash/flattenDeep');
const _uniqBy = require('lodash/uniqBy');

function makeURIformat(arr) {
  return arr.map(tag => encodeURIComponent(tag.trim()));
}

function makeRequest(tag, area) {
  return new Promise(resolve => {
    request(
      `https://www.varagesale.com/m/${area}/find?q=${tag}`,
      (err, response, html) => {
        if (err) {
          resolve({ error: true, code: err });
        } else {
          const $ = cheerio.load(html);
          let results = [];
          $('.card').each((index, element) => {
            const image = $(element).find('img').attr('data-src');
            const price = $(element).find('.green.bold.font-sm').text().replace('$', '');
            const link = 'https://varagesale.com' + $(element).find('.js-analytics-click-item').attr('href');
            const title = $(element).find('.b-margin-0').text();
            const imageSplit = image.split('=');
            const id = imageSplit[imageSplit.length - 1];
            results.push({
              image,
              price,
              link,
              title,
              description: title,
              id,
              key: id,
              source: 'VarageSale',
              type: 'listings'
            });
          });
          resolve(results);
        }
      });
  });
}

router.post('/', (req, res) => {
  if (req.body.tags && req.body.hasOwnProperty('area') && req.body.area.hasOwnProperty('varage')) {
    const tags = makeURIformat(req.body.tags);
    Promise.all(tags.map(t => makeRequest(t, req.body.area.varage)))
      .then(results => {
        if (!results || !results.length) {
          res.status(500).json({
            error: true,
            code: results[0].code,
            message: 'ERROR: Problem fetching VarageSale results'
          });
        } else {
          const errResults = results.map(r => (r.error ? 1 : 0)).reduce((a, b) => a + b, 0);
          if (errResults === results.length) {
            res.status(500).json({
              error: true,
              code: results[0].code,
              message: 'ERROR: Problem fetching VarageSale results'
            });
          } else {
            const cleaned = results.map(r => (r.error ? [] : r));
            const concatted = _uniqBy(_flattenDeep(cleaned), 'id');
            res.status(200).json({ error: false, payload: concatted });
          }
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: true, code: err, message: 'ERROR: Problem fetching VarageSale results.' });
      });
  } else {
    res.status(400).send({ error: true, message: 'ERROR: Request seems to be malformed.' });
  }
});

module.exports = router;
