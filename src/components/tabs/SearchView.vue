<template>
  <section class="results-tab">
    <section class="result-tab--listings">
      <h2>Item Listings</h2>
      <div class="result-tab--grouped" v-if="viewSelected === 'grouped'">
        <CollapseResults v-if="results && results.cll && results.cll.length" :source="'Craigslist'" :dataArr="results.cll"/>
        <!-- <CollapseResults v-if="results && results.lgl && results.lgl.length" :source="'LetGo'" :dataArr="results.lgl"/> -->
        <CollapseResults v-if="results && results.oul && results.oul.length" :source="'OfferUp'" :dataArr="results.oul"/>
      </div>
      <div class="result-tab--combined" v-if="viewSelected === 'combined'">
        <CollapseResults v-if="results && results.combinedListings && results.combinedListings.length" :source="'Listings'" :dataArr="combinedListings"/>
      </div>
      <div class="result-tab--no-results" v-if="noListings">
        No listings met your search criteria.
      </div>
    </section>
    <section class="result-tab--sales">
      <h2>Garage Sales</h2>
      <div class="result-tab--sales--grouped" v-if="viewSelected === 'grouped'">
        <CollapseResults v-if="results && results.cls && results.cls.length" :source="'Craigslist'" :dataArr="results.cls"/>
      </div>
      <div class="result-tab--sales--combined" v-if="viewSelected === 'combined'">
        <CollapseResults v-if="results && results.cls && results.cls.length" :source="'Sales'" :dataArr="combinedSales"/>
      </div>
      <div class="result-tab--no-results" v-if="noSales">
        No garage sales met your search criteria.
      </div>
    </section>
  </section>
</template>

<script>
import CollapseResults from './components/CollapseResults';
import GetData from './services/getData.service.js';
import Sort from './services/sort.service.js';
import AppLogic from './services/appLogic.service.js';

export default {
  name: 'searchView',
  components: {
    CollapseResults
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
  },
  methods: {
    runSearch: function(search) {
      this.clearResults();
      this.isLoading = true;
      GetData.fetch(search).then(result => {
        console.log('result', result);
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
  }
};
</script>

<style lang="scss" scoped>
.results-tab {
}
</style>