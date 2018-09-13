const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
const router = express.Router();
const _flattenDeep = require('lodash/flattenDeep');
const _uniqBy = require('lodash/uniqBy');
const _isFinite = require('lodash/isFinite');
const subDays = require('date-fns/sub_days');
const subWeeks = require('date-fns/sub_weeks')
const format = require('date-fns/format');

function makeURIformat(arr) {
  // return arr.map(tag => encodeURIComponent(tag.trim())).join();
  return arr.map(tag => encodeURIComponent(tag.trim()));
}

function timeUnitCoversion(num, unit) {
  const now = new Date();
  switch (unit) {
    case 'days':
      return subDays(now, num);
    case 'weeks':
      return subWeeks(now, num);
    case 'month':
      return subDays(now, 30);
    default:
      return now;
  }
}

// the point of this is to make Ooodles dates sortable with the other sources dates
function makeDateUsable(str) {
  const strSplit = str.split(' ');
  const firstNum = parseInt(strSplit[0]);
  if (_isFinite(firstNum)) {
    // assuming it says something like '1 day ago', '2 weeks ago', etc here
    return format(timeUnitCoversion(firstNum, strSplit[1]), 'MM/DD/YYYY hh:mm a');
  } else {
    // assuming it says 'Over 4 weeks ago' here. Could be wrong but haven't done enough looking to make sure.
    return format(subDays(new Date(), 42), 'MM/DD/YYYY hh:mm a');
  }
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
          const date = makeDateUsable(
            $(element)
              .find('.posted-on > span:nth-child(1)')
              .text()
          );
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
