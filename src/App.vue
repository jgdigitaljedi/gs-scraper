<template>
  <div id="app">
    <SearchForm msg="test" v-on:runSearch="runSearch"/>
  </div>
</template>

<script>
import SearchForm from './components/SearchForm';
import Craigslist from './services/craiglist.service.js';

export default {
  name: 'app',
  components: {
    SearchForm
  },
  methods: {
    runSearch: function(search) {
      console.log('run search', search);
      Craigslist.get(search).then(result => {
        console.log('result', result);
      });
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
