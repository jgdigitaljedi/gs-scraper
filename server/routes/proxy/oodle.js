const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const userRequest = req.body;
  // @TODO: make this handle multiple tags with multiple requests
  if (userRequest.hasOwnProperty('area') && userRequest.hasOwnProperty('tags')) {
    request(`https://forsale.oodle.com/classifieds/${userRequest.area.oodle}/?q=${userRequest.tags[0]}&oldq=${userRequest.tags[0]}&inbs=1`, (err, response, html) => {
      if (err) {
        res.status(500).json({ error: true, code: err, message: 'ERROR: Problem fetching Oodle  results' });
      }
      const $ = cheerio.load(html);
      let results = [];
      $('.listing').each((i, element) => {
        let title = $(element).find('a.title-link').text() || '';
        if (title) {
          title = title.replace(/(\r\n\t|\n|\r\t)/gm, '');
        }
        const image = $(element).find('img').attr('src') || null;
        const price = $(element).find('.price > span').text().replace('$', '');
        const description = $(element).find('.listing-body > span').text();
        const id = $(element).find('.new-listingaction').attr('data-listingid');
        const date = $(element).find('.posted-on > span:nth-child(1)').text();
        const link = $(element).find('.new-listing-action li:nth-child(2) > a').attr('href');
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
      res.status(200).json({ error: false, payload: results });
    });
  } else {
    res.status(400).json({ error: true, message: 'ERROR: Your request may have been malformed.' });
  }
});

module.exports = router;
