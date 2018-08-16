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
    key: index,
    source: 'LetGo'
  };
}

router.post('/', function (req, res) {
  const tagsURI = makeURIformat(req.body.tags);
  axios
    .get(
      `https://search-products-pwa.letgo.com/api/products?country_code=US&offset=0&search_term=${tagsURI}&quadkey=${req.body.area.lgKey}&sort=recent&num_results=32&distance_type=mi`,
      {
        headers: {
          // Cookie:
          //   'pwa_leanplumUserId=b144fccf-00cb-4d5f-912c-6686b125dfc7; install_auth=%7B%22id%22%3A%220d45328f-0d5c-456c-b801-cf7dbaaa6fbb%22%2C%22token%22%3A%22eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpbnN0YWxsYXRpb25zIiwic3ViIjoiMGQ0NTMyOGYtMGQ1Yy00NTZjLWI4MDEtY2Y3ZGJhYWE2ZmJiIiwianRpIjoiYWI5YjNiMjY1MzE2ZjgzMDgyMTE3Y2ZmNzRiOWUwMzY3NTI2YTI4MzA4MGNjZmNmZWE5MjM2ZTA2YTg4YzQyZDdmMmQxNDhlZDYwMTY1NmZhMzZiNjIzNGRlMmY3OWJiMWM3MDUwYzVjNjhmOWViYjk4YWUwMzVjMGUxNDViNDQiLCJpYXQiOjE1MzQzMzI5MDksIm5iZiI6MTUzNDMzMjkwOSwiZXhwIjoxNTM0MzM2NTA5LCJkYXRhIjp7InJvbGVzIjpbImFwcCJdfSwiYnR2IjoyLCJ0ZWQiOiJ5dStwUk8rYThXQ3hiMTZtV0U4N3cyRWlBTEs1cEVGdVdHRUdGM0pnVFhwRml5Y25aMXVcL0dRYnl4d0pTVnJaMXN1d08ifQ.vsYEi81X5Fx8cii6nqMy2O5o82qOHASzJ4KH1CRdLbI%22%7D; ak_bmsc=7575ACB39B6C97E43B5BCB885C1CBE41172B3D4F1F5000007C35745B6C268A6D~plpMOQ8iqkX0adeueNAXXAz0++eSM62Kl0qFoq8bK6viOv3p/ts+7W54qS31GWahqR2Hd9CErDaBzeqBWv23d0Md6FROiTESsFPruL2LRJkbs4/cT9N0gqSiaBtWd8jgqyCbzAswBbFSSD6narNOn8pAJSzu7N2ylZO9YVOQHLAqQVKQxQ3rEzlYnHgFGusYlscJPhPj16ysjZfa4yEJjWjdaygyxQzMgCAuYIrp0OXzg=',
          // Host: 'search-products-pwa.letgo.com',
          // 'Upgrade-Insecure-Requests': 1,
          Origin: 'https://oc.letgo.com'
        }
      }
    )
    .then(response => {
      res.send({ letgoResponse: response });
    })
    .catch(err => {
      res.send({ letgoErr: err });
    });
});

module.exports = router;
