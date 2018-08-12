import axios from 'axios';
import xml2js from 'xml2js';
import { format } from 'date-fns';

const parser = new xml2js.Parser();
export default {
  get(data) {
    return axios
      .get(`http://${data.area}.craigslist.org/search/sss?format=rss&query=${data.tags}`)
      .then(response => {
        return new Promise((resolve, reject) => {
          parser.parseString(response.data, (err, result) => {
            if (!err) {
              console.log('returning result', result);
              // resolve(result['rdf:RDF'].item);
              resolve(result['rdf:RDF'].item.map(i => this.formatItem(i)));
            } else {
              console.log('returning err', err);
              reject(err);
            }
          });
        });
      });
  },
  getGarageSales(data) {
    return axios
      .get(`https://${data.area}.craigslist.org/search/gms?format=rss&query=${data.tags}`)
      .then(response => {
        console.log('garage sale response', response);
      });
  },
  formatItem(item) {
    return {
      title: item.hasOwnProperty('title') ? item.title[0] : 'NO TITLE',
      date: item.hasOwnProperty('dc:date')
        ? format(item['dc:date'][0], 'MM/DD/YYYY hh:mm a')
        : 'NO DATE',
      link: item.hasOwnProperty('link') ? item.link[0] : null,
      description: item.hasOwnProperty('description') ? item.description[0] : 'NO DESCRIPTION',
      image: item.hasOwnProperty('enc:enclosure') ? item['enc:enclosure'][0].$.resource : null
    };
  }
};
