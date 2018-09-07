const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
const router = express.Router();
const _flattenDeep = require('lodash/flattenDeep');
const _uniqBy = require('lodash/uniqBy');

function makeURIformat(arr) {
  // return arr.map(tag => encodeURIComponent(tag.trim())).join();
  return arr.map(tag => encodeURIComponent(tag.trim()));
}

function makeRequest(area, tag, widen) {
  return new Promise(resolve => {
    request(
      `https://forsale.oodle.com/classifieds/${area}/?q=${tag}&oldq=${tag}&inbs=1`,
      (err, response, html) => {
        if (err) {
          resolve({ error: true, code: err });
        }
        const $ = cheerio.load(html);
        let results = [];
        $('.listing').each((i, element) => {
          let title =
            $(element)
              .find('a.title-link')
              .text() || '';
          if (title) {
            title = title.replace(/(\r\n\t|\n|\r\t)/gm, '');
          }
          const image =
            $(element)
              .find('img')
              .attr('src') || null;
          const price = $(element)
            .find('.price > span')
            .text()
            .replace('$', '');
          const description = $(element)
            .find('.listing-body > span')
            .text();
          const id = $(element)
            .find('.new-listingaction')
            .attr('data-listingid');
          const date = $(element)
            .find('.posted-on > span:nth-child(1)')
            .text();
          const link = $(element)
            .find('.new-listing-action li:nth-child(2) > a')
            .attr('href');
          results.push({
            title,
            image,
            price,
            description,
            id,
            key: id,
            date,
            type: 'listings',
            link,
            source: 'Oodle'
          });
        });
        resolve(results);
      }
    );
  });
}

router.post('/', (req, res) => {
  const userRequest = req.body;
  if (userRequest.hasOwnProperty('area') && userRequest.hasOwnProperty('tags')) {
    const tagsURI = makeURIformat(userRequest.tags);
    Promise.all(tagsURI.map(r => makeRequest(userRequest.area.oodle, r, userRequest.widen)))
      .then(results => {
        if (!results || !results.length) {
          res.status(500).json({
            error: true,
            code: results[0].code,
            message: 'ERROR: Problem fetching Oodle results'
          });
        } else {
          const errResults = results.map(r => (r.error ? 1 : 0)).reduce((a, b) => a + b, 0);
          if (errResults === results.length) {
            res.status(500).json({
              error: true,
              code: results[0].code,
              message: 'ERROR: Problem fetching Oodle results'
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
          .json({ error: true, code: err, message: 'ERROR: Problem fetching Oodle results.' });
      });
  } else {
    res.status(400).json({ error: true, message: 'ERROR: Your request may have been malformed.' });
  }
});

module.exports = router;
