<template>
  <div id="app">
    <SearchForm msg="test" v-on:runSearch="runSearch" class="sidebar"/>
    <div class="result-area" v-if="results && results.length">
      <h2>Item Listings</h2>
      <div class="result-area--listings">
        <ResultCard v-for="result in results" :key="result.date" :data="result"/>
      </div>
      <h2>Garage Sales</h2>
      <div class="result-area--sales">
      </div>
    </div>
  </div>
</template>

<script>
import SearchForm from './components/SearchForm';
import Craigslist from './services/craiglist.service.js';
import ResultCard from './components/ResultCard';

export default {
  name: 'app',
  components: {
    SearchForm,
    ResultCard
  },
  data: function() {
    return {
      results: null
    };
  },
  methods: {
    runSearch: function(search) {
      if (search.cll) {
        Craigslist.get(search).then(result => {
          console.log('result', result);
          this.results = result;
        });
      }
      if (search.cls) {
        Craigslist.getGarageSales(search).then(result => {
          console.log('gs result', result);
        });
      }
    }
  }
};
</script>

/*eslint-disable */
<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding-top: 60px;
  background-color: #fafafa;
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  .sidebar {
    min-width: 300px;
    border-right: 1px solid #ccc;
  }
  .result-area {
    width: 100%;
    h2 {
      font-size: 1.5em;
      font-weight: bold;
      margin-left: 0.5em;
    }
    .result-area--listings,
    .result-area--sales {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
    }
    .result-card {
      max-width: 400px;
      margin: 1em;
    }
  }
}
</style>
/*eslint-enable */
