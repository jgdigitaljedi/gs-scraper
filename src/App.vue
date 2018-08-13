<template>
  <div id="app">
    <SearchForm msg="test" v-on:runSearch="runSearch" class="sidebar"/>
    <div class="result-area">
      <h2>Item Listings</h2>
      <h4>Craigslist</h4>
      <div class="result-area--listings" v-if="results && results.length">
        <ResultCard v-for="result in results" :key="result.date" :data="result"/>
      </div>
      <h4>LetGo</h4>
      <div class="result-area--listings" v-if="lgResults && lgResults.length">
        <ResultCard v-for="result in lgResults" :key="result.key" :data="result"/>
      </div>
      <h2 v-if="gsResults && gsResults.length">Garage Sales</h2>
      <div class="result-area--sales" v-if="gsResults && gsResults.length">
        <ResultCard v-for="result in gsResults" :key="result.date" :data="result"/>
      </div>
    </div>
  </div>
</template>

<script>
import SearchForm from './components/SearchForm';
import Craigslist from './services/craiglist.service.js';
import Letgo from './services/letgo.service.js';
import ResultCard from './components/ResultCard';

export default {
  name: 'app',
  components: {
    SearchForm,
    ResultCard
  },
  data: function() {
    return {
      results: null,
      gsResults: null,
      lgResults: null
    };
  },
  methods: {
    runSearch: function(search) {
      console.log('search', search);
      if (search.cll) {
        Craigslist.get(search).then(result => {
          console.log('result', result);
          this.results = result;
        });
      } else {
        this.results = [];
      }
      if (search.cls) {
        Craigslist.getGarageSales(search).then(result => {
          console.log('gs result', result);
          this.gsResults = result;
        });
      } else {
        this.gsResults = [];
      }
      if (search.lgl) {
        Letgo.searchLetgo(search).then(result => {
          console.log('letGo bitches', result);
          this.lgResults = result;
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
