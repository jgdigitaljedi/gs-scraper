import axios from 'axios';
import xml2js from 'xml2js';
import { format } from 'date-fns';

const parser = new xml2js.Parser();
export default {
  getPrice(str) {
    const strSplit = str.split(' ');
    return strSplit[strSplit.length - 1].split(';')[1];
  },
  cleanTitle(title) {
    const titleSplit = title.split(' ');
    titleSplit.splice(-1, 1);
    return titleSplit.join(' ');
  },
  makeURIformat(arr) {
    return arr.map(tag => encodeURIComponent(tag.trim())).join();
  },
  get(data) {
    if (data && data.hasOwnProperty('tags') && data.hasOwnProperty('area')) {
      const tagsURI = this.makeURIformat(data.tags);
      return axios
        .get(`http://${data.area}.craigslist.org/search/sss?format=rss&query=${tagsURI}`)
        .then(response => {
          return new Promise((resolve, reject) => {
            parser.parseString(response.data, (err, result) => {
              if (!err) {
                resolve(result['rdf:RDF'].item.map((i, index) => this.formatItem(i, index + 2000)));
              } else {
                reject(err);
              }
            });
          });
        })
        .catch(err => {
          return { error: true, message: err };
        });
    }
  },
  getGarageSales(data) {
    const tagsURI = this.makeURIformat(data.gs);
    return axios
      .get(`https://${data.area}.craigslist.org/search/gms?format=rss&query=${tagsURI}`)
      .then(response => {
        return new Promise((resolve, reject) => {
          parser.parseString(response.data, (err, result) => {
            if (!err) {
              resolve(result['rdf:RDF'].item.map((i, index) => this.formatItem(i, index + 1000)));
            } else {
              reject(err);
            }
          });
        });
      });
  },
  formatItem(item, index) {
    const title = item.hasOwnProperty('title') ? item.title[0] : null;
    return {
      title: title ? this.cleanTitle(title) : 'NO TITLE',
      date: item.hasOwnProperty('dc:date')
        ? format(item['dc:date'][0], 'MM/DD/YYYY hh:mm a')
        : 'NO DATE',
      link: item.hasOwnProperty('link') ? item.link[0] : null,
      description: item.hasOwnProperty('description') ? item.description[0] : 'NO DESCRIPTION',
      image: item.hasOwnProperty('enc:enclosure') ? item['enc:enclosure'][0].$.resource : null,
      price: title ? this.getPrice(title) : 'NO PRICE',
      key: index
    };
  }
};
