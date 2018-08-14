import Vue from 'vue';
import Buefy from 'buefy';
import '../node_modules/buefy/lib/buefy.css';
import App from './App.vue';
import Craigslist from './services/craiglist.service';
import Letgo from './services/letgo.service';
import GetData from './services/getData.service';
import { Toast } from 'buefy';

Vue.use(Buefy, {
  defaultToastDuration: 2000,
  defaultContainerElement: '#app'
});

Vue.component(Buefy.Field.name, Buefy.Field);
Vue.component(Buefy.Input.name, Buefy.Input);
Vue.component(Buefy.Taginput.name, Buefy.Taginput);
Vue.component(Buefy.Icon.name, Buefy.Icon);
Vue.component(Buefy.Checkbox.name, Buefy.Checkbox);
Vue.component(Buefy.Collapse.name, Buefy.Collapse);

Vue.prototype.$toast = Toast;

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  Craigslist,
  Letgo,
  GetData
}).$mount('#app');
