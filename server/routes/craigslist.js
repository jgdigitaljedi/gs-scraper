const express = require('express');
const router = express.Router();
const format = require('date-fns/format');
const axios = require('axios');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

function makeURIformat(arr) {
  return arr.map(tag => encodeURIComponent(tag.trim())).join();
}

function getPrice(str) {
  const strSplit = str.split(' ');
  return strSplit[strSplit.length - 1].split(';')[1];
}

function cleanTitle(title) {
  const titleSplit = title.split(' ');
  titleSplit.splice(-1, 1);
  return titleSplit.join(' ');
}

function formatItem(item, index) {
  const title = item.hasOwnProperty('title') ? item.title[0] : null;
  return {
    title: title ? cleanTitle(title) : 'NO TITLE',
    date: item.hasOwnProperty('dc:date')
      ? format(item['dc:date'][0], 'MM/DD/YYYY hh:mm a')
      : 'NO DATE',
    link: item.hasOwnProperty('link') ? item.link[0] : null,
    description: item.hasOwnProperty('description') ? item.description[0] : 'NO DESCRIPTION',
    image: item.hasOwnProperty('enc:enclosure') ? item['enc:enclosure'][0].$.resource : null,
    price: title ? getPrice(title) : 'NO PRICE',
    key: index,
    source: 'Craiglist'
  };
}
router.post('/', function (req, res) {
  const tagsURI = makeURIformat(req.body.tags);
  const which =
    req.body.which === 'garage sales'
      ? `https://${req.body.area.uri}.craigslist.org/search/${
      req.body.area.clExtra
      }gms?format=rss&query=${tagsURI}`
      : `http://${req.body.area.uri}.craigslist.org/search/${
      req.body.area.clExtra
      }sss?format=rss&query=${tagsURI}`;
  axios
    .get(which)
    .then(response => {
      parser.parseString(response.data, (err, result) => {
        if (!err) {
          if (
            result &&
            result.hasOwnProperty('rdf:RDF') &&
            result['rdf:RDF'].hasOwnProperty('item') &&
            result['rdf:RDF'].item
          ) {
            res
              .status(200)
              .send(result['rdf:RDF'].item.map((i, index) => formatItem(i, index + 2000)));
          } else {
            res.status(200).send(null);
          }
        } else {
          res.status(500).send(err);
        }
      });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

module.exports = router;
