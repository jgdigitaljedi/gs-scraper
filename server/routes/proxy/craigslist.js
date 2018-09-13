const express = require('express');
const router = express.Router();
const format = require('date-fns/format');
const axios = require('axios');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const _flattenDeep = require('lodash/flattenDeep');
const _uniqBy = require('lodash/uniqBy');

function makeURIformat(arr) {
  // return arr.map(tag => encodeURIComponent(tag.trim())).join();
  return arr.map(tag => encodeURIComponent(tag.trim()));
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

function nearbyString(area) {
  switch (area) {
    case 'austin':
      return '&nearbyArea=270&nearbyArea=327&nearbyArea=449&searchNearby=1';
    case 'dallas':
      return '&nearbyArea=308&searchNearby=1';
    case 'wichitafalls':
      return '&nearbyArea=422&nearbyArea=649&searchNearby=1';
    case 'sfbay':
      return '&nearbyArea=102&nearbyArea=12&nearbyArea=373&searchNearby=1';
    case 'knoxville':
      return '&searchNearby=1';
    case 'ridgefield':
      return '';
    default:
      return '';
  }
}

function formatItem(item, index, which) {
  // console.log('item', item);
  const title = item.hasOwnProperty('title') ? item.title[0] : null;
  const idArr = item.hasOwnProperty('link') ? item.link[0].split('/') : null;
  const idArrLast = idArr && idArr.length ? idArr.length - 1 : null;
  const id = idArrLast ? idArr[idArrLast].split('.')[0] : null;
  return {
    title: title ? cleanTitle(title) : 'NO TITLE',
    date: item.hasOwnProperty('dc:date')
      ? format(item['dc:date'][0], 'MM/DD/YYYY hh:mm a')
      : 'NO DATE',
    link: item.hasOwnProperty('link') ? item.link[0] : null,
    description: item.hasOwnProperty('description') ? item.description[0] : 'NO DESCRIPTION',
    image: item.hasOwnProperty('enc:enclosure') ? item['enc:enclosure'][0].$.resource : null,
    price: title ? getPrice(title) : 'NO PRICE',
    key: id ? id : index,
    id: id,
    source: 'Craigslist',
    type: which
  };
}

function parseResult(response, keyBase, which) {
  return new Promise((resolve, reject) => {
    parser.parseString(response, (err, result) => {
      if (!err) {
        if (
          result &&
          result.hasOwnProperty('rdf:RDF') &&
          result['rdf:RDF'].hasOwnProperty('item') &&
          result['rdf:RDF'].item
        ) {
          resolve(result['rdf:RDF'].item.map((i, index) => formatItem(i, index + keyBase, which)));
        } else {
          resolve(null);
        }
      } else {
        reject(err);
      }
    });
  });
}

function makeWhich({ which, area, widen }, tag) {
  return which === 'garage sales'
    ? `https://${area.uri}.craigslist.org/search/${area.clExtra}gms?format=rss&query=${tag}${
    widen ? nearbyString(area.uri) : ''
    }`
    : `https://${area.uri}.craigslist.org/search/${area.clExtra}sss?format=rss&query=${tag}${
    widen ? nearbyString(area.uri) : ''
    }`;
}

router.post('/', function (req, res) {
  const tagsURI = makeURIformat(req.body.tags);
  axios
    .all(tagsURI.map(tag => axios.get(makeWhich(req.body, tag))))
    .then(results => {
      const response = results.map(r => r.data);
      const combinedPromises = response.map((r, index) => {
        return parseResult(r, 2000 * (index + 1), req.body.which);
      });
      Promise.all(combinedPromises)
        .then(resArr => {
          if (resArr && resArr.length) {
            res.status(200).send(_uniqBy(_flattenDeep(resArr), 'id'));
          } else {
            res.status(200).send(null);
          }
        })
        .catch(error => {
          res.status(500).send(error);
        });
    })
    .catch(err => {
      res.send(err);
    });
});

module.exports = router;
