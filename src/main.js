import Vue from 'vue';
import Field from '../node_modules/buefy/src/components/field';
import Input from '../node_modules/buefy/src/components/input';
import '../node_modules/buefy/lib/buefy.css';
import App from './App.vue';
import craigslist from './services/craiglist.service';

Vue.use(Field);
Vue.use(Input);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  craigslist
}).$mount('#app');
