<template>
  <div id="app">
    <SearchForm msg="test" v-on:runSearch="runSearch" class="sidebar"/>
    <div class="result-area" v-if="results && results.length">
      <ResultCard v-for="result in results" :key="result.date" :data="result"/>
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
      console.log('run search', search);
      Craigslist.get(search).then(result => {
        console.log('result', result);
        this.results = result;
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
  // text-align: center;
  color: #2c3e50;
  padding-top: 60px;
  background-color: #fafafa;
  display: flex;
  flex-direction: row;
  .sidebar {
    min-width: 300px;
    border-right: 1px solid #ccc;
  }
  .result-area {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    .result-card {
      max-width: 400px;
      margin: 1em;
    }
  }
}
</style>
