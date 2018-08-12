// http://YOURCITY.craigslist.org/search/sss?format=rss&query=SearchString
import axios from 'axios';
import xml2js from 'xml2js';
const parseString = xml2js.parseString;

export default function craiglist(data) {
  return axios
    .get(`http://${data.city}.craigslist.org/search/sss?format=rss&query=${data.search}`)
    .then(response => {
      parseString(response.data, function(err, result) {
        self.events = result;
      });
    });
}
