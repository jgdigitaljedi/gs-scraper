<template>
  <div id="app">
    <div class="sidebar">
      <SearchForm msg="test" v-on:runSearch="runSearch" class="sidebar"/>
      <hr>
      <ViewOptions v-on:viewChanged="viewChanged" v-on:sortSelected="sortResults"/>
    </div>
    <div class="result-area">
      <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="false"></b-loading>
      <section class="result-area--listings">
        <h2>Item Listings</h2>
        <div class="result-area--grouped" v-if="viewSelected === 'grouped'">
          <CollapseResults v-if="results && results.cll && results.cll.length" :source="'Craigslist'" :dataArr="results.cll"/>
          <CollapseResults v-if="results && results.lgl && results.lgl.length" :source="'LetGo'" :dataArr="results.lgl"/>
          <CollapseResults v-if="results && results.oul && results.oul.length" :source="'OfferUp'" :dataArr="results.oul"/>
        </div>
        <div class="result-area--combined" v-if="viewSelected === 'combined'">
          <CollapseResults v-if="results && results.combinedListings && results.combinedListings.length" :source="'Listings'" :dataArr="results.combinedListings"/>
        </div>
        <div class="result-area--no-results" v-if="noListings">
          No listings met your search criteria.
        </div>
      </section>
      <section class="result-area--sales">
        <h2>Garage Sales</h2>
        <div class="result-area--sales--grouped" v-if="viewSelected === 'grouped'">
          <CollapseResults v-if="results && results.cls && results.cls.length" :source="'Craigslist'" :dataArr="results.cls"/>
        </div>
        <div class="result-area--sales--combined" v-if="viewSelected === 'combined'">
          <CollapseResults v-if="results && results.cls && results.cls.length" :source="'Sales'" :dataArr="results.combinedSales"/>
        </div>
        <div class="result-area--no-results" v-if="noSales">
          No garage sales met your search criteria.
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import SearchForm from './components/SearchForm';
import CollapseResults from './components/CollapseResults';
import ViewOptions from './components/ViewOptions';
import GetData from './services/getData.service.js';

export default {
  name: 'app',
  components: {
    SearchForm,
    CollapseResults,
    ViewOptions
  },
  data: function() {
    return {
      results: Object,
      noListings: Boolean,
      noSales: Boolean,
      searchRan: Boolean,
      isLoading: Boolean,
      viewSelected: String
    };
  },
  methods: {
    runSearch: function(search) {
      this.clearResults();
      this.isLoading = true;
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
        this.isLoading = false;
        this.noResults();
      });
    },
    clearResults() {
      const keys = Object.keys(this.results);
      keys.forEach(key => {
        this.results[key] = null;
      });
    },
    noResults() {
      const listings = ['cll', 'lgl', 'oul'];
      const sales = ['cls'];

      this.noListings =
        listings
          .map(item => {
            return this.results &&
              this.results.hasOwnProperty(item) &&
              this.results[item] &&
              this.results[item].length
              ? 1
              : 0;
          })
          .reduce((a, b) => a + b) === 0;

      this.noSales =
        sales
          .map(item => {
            return this.results &&
              this.results.hasOwnProperty(item) &&
              this.results[item] &&
              this.results[item].length
              ? 1
              : 0;
          })
          .reduce((a, b) => a + b) === 0;
    },
    viewChanged: function(viewType) {
      this.viewSelected = viewType;
    },
    sortResults: function(theSort) {
      console.log('theSort', theSort);
      console.log('sorted listings', theSort.sort(this.results.combinedListings));
      this.results.combinedListings = theSort.sort(this.results.combinedListings);
      this.results.combinedSales = theSort.sort(this.results.combinedSales);
    }
  },
  created() {
    this.results = {
      cll: null,
      cls: null,
      lgl: null
    };
    this.isLoading = false;
    this.noListings = false;
    this.noSales = false;
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
    .view-options {
      padding: 1em;
      h3 {
        font-weight: bold;
        margin-bottom: 1em;
      }
    }
  }
  .result-area {
    width: 100%;
    h2 {
      font-size: 2em;
      font-weight: bold;
      margin-left: 0.5em;
    }
    .result-area--no-results {
      font-style: italic;
      margin-left: 2em;
    }
  }
}
</style>
/*eslint-enable */
