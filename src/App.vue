<template>
  <div id="app">
    <button class="button hide-icon is-success" v-on:click="hideSidebar = !hideSidebar">
      <b-icon v-if="!hideSidebar" icon="eye-off"></b-icon>
      <b-icon v-if="hideSidebar" icon="eye"></b-icon>
    </button>
    <div class="sidebar" :class="{'hidden': hideSidebar}">
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
          <!-- <CollapseResults v-if="results && results.lgl && results.lgl.length" :source="'LetGo'" :dataArr="results.lgl"/> -->
          <CollapseResults v-if="results && results.oul && results.oul.length" :source="'OfferUp'" :dataArr="results.oul"/>
        </div>
        <div class="result-area--combined" v-if="viewSelected === 'combined'">
          <CollapseResults v-if="results && results.combinedListings && results.combinedListings.length" :source="'Listings'" :dataArr="combinedListings"/>
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
          <CollapseResults v-if="results && results.cls && results.cls.length" :source="'Sales'" :dataArr="combinedSales"/>
        </div>
        <div class="result-area--no-results" v-if="noSales">
          No garage sales met your search criteria.
        </div>
      </section>
    </div>
    <back-to-top visibleoffset="500">
      <button class="button is-success">
        <b-icon icon="chevron-double-up"></b-icon>
        <span>&nbsp; Top</span>
      </button>
    </back-to-top>
  </div>
</template>

<script>
import SearchForm from './components/SearchForm';
import CollapseResults from './components/CollapseResults';
import ViewOptions from './components/ViewOptions';
import GetData from './services/getData.service.js';
// import { mapState } from 'vuex';
import Sort from './services/sort.service.js';
import { mapGetters } from 'vuex';
import BackToTop from 'vue-backtotop';

export default {
  name: 'app',
  components: {
    SearchForm,
    CollapseResults,
    ViewOptions,
    BackToTop
  },
  data: function() {
    return {
      results: Object,
      noListings: Boolean,
      noSales: Boolean,
      searchRan: Boolean,
      isLoading: Boolean,
      viewSelected: String,
      combinedListings: Array,
      combinedSales: Array,
      hideSidebar: Boolean
    };
  },
  computed: mapGetters(['searchTags', 'salesTags']),
  methods: {
    runSearch: function(search) {
      this.clearResults();
      this.isLoading = true;
      GetData.fetch(search).then(result => {
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
        this.combinedListings = this.results.combinedListings;
        this.combinedSales = this.results.combinedSales;
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
      const listings = ['cll', 'oul'];
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
      const rev = theSort.hasOwnProperty('reverse') && theSort.reverse;
      if (this.viewSelected === 'combined') {
        this.combinedListings = theSort.sort(
          [...this.results.combinedListings],
          Array.from(this.searchTags),
          rev
        );
        this.combinedSales = theSort.sort(
          [...this.results.combinedSales],
          Array.from(this.salesTags),
          rev
        );
      } else {
        const keys = Object.keys(this.results);
        keys.forEach(key => {
          this.results[key] = Sort.sortGrouped(
            this.results[key],
            theSort,
            rev,
            Array.from(this.searchTags),
            Array.from(this.salesTags),
            key
          );
        });
      }
    }
  },
  created() {
    this.results = {
      cll: null,
      cls: null,
      lgl: null,
      oul: null
    };
    this.isLoading = false;
    this.noListings = false;
    this.noSales = false;
    this.hideSidebar = false;
  }
};
</script>

/*eslint-disable */
<style lang="scss">
@import './styles/theme.scss';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding-top: 30px;
  background-color: #fafafa;
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  width: 100%;
  .hide-button {
    top: 0;
    left: 0;
    position: absolute;
    z-index: 10;
  }
  .sidebar {
    min-width: 300px;
    border-right: 1px solid #ccc;
    transition: all 0.5s;
    &.hidden {
      transform: translateX(-100%);
      width: 0;
      display: none;
    }
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
