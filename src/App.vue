<template>
  <div id="app">
    <SearchForm msg="test" v-on:runSearch="runSearch" class="sidebar"/>
    <div class="result-area">
      <section class="result-area--listings">
        <h2>Item Listings</h2>
        <CollapseResults v-if="results && results.cll && results.cll.length" :source="'Craigslist'" :dataArr="results.cll"/>
        <CollapseResults v-if="results && results.lgl && results.lgl.length" :source="'LetGo'" :dataArr="results.lgl"/>
      </section>
      <section class="result-area--sales">
        <h2>Garage Sales</h2>
        <CollapseResults v-if="results && results.cls && results.cls.length" :source="'Craigslist'" :dataArr="results.cls"/>
      </section>
    </div>
  </div>
</template>

<script>
import SearchForm from './components/SearchForm';
import CollapseResults from './components/CollapseResults';
import GetData from './services/getData.service.js';

export default {
  name: 'app',
  components: {
    SearchForm,
    CollapseResults
  },
  data: function() {
    return {
      results: Object
    };
  },
  methods: {
    runSearch: function(search) {
      GetData.fetch(search).then(result => {
        console.log('master result', result);
        const keys = Object.keys(result);
        keys.forEach(key => {
          if (Array.isArray(result[key])) {
            this.results[key] = result[key];
          } else if (result[key]) {
            this.results[key] = null;
            if (result[key].error) {
              this.$toast.open({
                type: 'is-danger',
                message: result[key].message
              });
            } else {
              this.$toast.open(result[key].message);
            }
          }
        });
      });
    }
  },
  created() {
    this.results = {
      cll: null,
      cls: null,
      lgl: null
    };
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
      font-size: 2em;
      font-weight: bold;
      margin-left: 0.5em;
    }
  }
}
</style>
/*eslint-enable */
