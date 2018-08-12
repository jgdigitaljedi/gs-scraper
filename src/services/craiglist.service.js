// http://YOURCITY.craigslist.org/search/sss?format=rss&query=SearchString
import axios from 'axios';
import xml2js from 'xml2js';

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
  formatItem(item) {
    return {
      title: item.hasOwnProperty('title') ? item.title[0] : 'NONE',
      date: item.hasOwnProperty('dc:date') ? item['dc:date'][0] : 'NONE',
      link: item.hasOwnProperty('link') ? item.link[0] : 'NONE',
      description: item.hasOwnProperty('description') ? item.description[0] : 'NONE'
    };
  }
};
