<template>
  <section class="results-tab">
    <section class="result-tab--listings">
      <h2>Item Listings</h2>
      <div class="result-tab--grouped" v-if="view === 'grouped'">
        <CollapseResults v-if="results && results.cll && results.cll.length" :source="'Craigslist'" :dataArr="results.cll" :hiddenView="false" />
        <CollapseResults v-if="results && results.lgl && results.lgl.length" :source="'LetGo'" :dataArr="results.lgl"/>
        <CollapseResults v-if="results && results.oul && results.oul.length" :source="'OfferUp'" :dataArr="results.oul" :hiddenView="false" />
        <CollapseResults v-if="results && results.ood && results.ood.length" :source="'Oodle'" :dataArr="results.ood" :hiddenView="false" />
        <CollapseResults v-if="results && results.vsl && results.vsl.length" :source="'VarageSale'" :dataArr="results.vsl" :hiddenView="false" />
      </div>
      <div class="result-tab--combined" v-if="view === 'combined'">
        <CollapseResults v-if="results && results.combinedListings && results.combinedListings.length" :source="'Listings'" :dataArr="combinedListings" :hiddenView="false" />
      </div>
      <div class="result-tab--no-results" v-if="noListings">
        No listings met your search criteria.
      </div>
    </section>
    <section class="result-tab--sales">
      <h2>Garage Sales</h2>
      <div class="result-tab--sales--grouped" v-if="view === 'grouped'">
        <CollapseResults v-if="results && results.cls && results.cls.length" :source="'Craigslist'" :dataArr="results.cls" :hiddenView="false" />
        <CollapseResults v-if="results && results.ess && results.ess.length" :source="'Estate Sales'" :dataArr="results.ess" :hiddenView="false" />
      </div>
      <div class="result-tab--sales--combined" v-if="view === 'combined'">
        <CollapseResults v-if="results && results.cls && results.cls.length" :source="'Sales'" :dataArr="combinedSales" :hiddenView="false" />
      </div>
      <div class="result-tab--no-results" v-if="noSales">
        No garage sales met your search criteria.
      </div>
    </section>
  </section>
</template>

<script>
import CollapseResults from '../CollapseResults';
import GetData from '../../services/getData.service.js';
import Sort from '../../services/sort.service.js';
import AppLogic from '../../services/appLogic.service.js';

export default {
  name: 'SearchView',
  components: {
    CollapseResults
  },
  props: {
    view: null,
    params: {},
    reset: null,
    sortOption: {},
    resetFaves: null
  },
  computed: {
    hiddenCards() {
      return this.$store.getters.hiddenCards;
    },
    faveCards() {
      return this.$store.getters.faveCards;
    },
    cSort() {
      return this.$store.getters.currentSort;
    }
  },
  data: function() {
    return {
      results: Object,
      noListings: Boolean,
      noSales: Boolean,
      isLoading: Boolean,
      combinedListings: [],
      combinedSales: []
    };
  },
  created() {
    this.results = {
      cll: null,
      cls: null,
      lgl: null,
      oul: null,
      ess: null,
      ood: null,
      vsl: null
    };
    this.isLoading = false;
    this.noListings = false;
    this.noSales = false;
  },
  methods: {
    setFaves(faves) {
      if (this.combinedListings && this.combinedListings.length) {
        const newListings = AppLogic.adjustResultsForFaves(this.combinedListings, faves);
        this.combinedListings = newListings;
      }
      if (this.combinedSales && this.combinedSales.length) {
        const newSales = AppLogic.adjustResultsForFaves(this.combinedSales, faves);
        this.combinedSales = newSales;
      }
      if (this.results) {
        const keys = Object.keys(this.results);
        keys.forEach(key => {
          if (this.results[key] && this.results[key].length) {
            const newKeyResults = AppLogic.adjustResultsForFaves(this.results[key], faves);
            this.results[key] = newKeyResults;
          }
        });
      }
    },
    resetHidden: function() {
      AppLogic.clearAll(this.results, this.combinedListings, this.combinedSales, 'hide')
        .then(results => {
          this.results = results.results;
          this.combinedListings = results.listings;
          this.combinedSales = results.sales;
          this.$store.commit('hiddenCards', []);
        })
        .catch(err => {
          this.$toast.open({
            type: 'is-danger',
            message: err.message
          });
        });
    },
    resetFaveResults: function() {
      AppLogic.clearAll(this.results, this.combinedListings, this.combinedSales, 'favorite')
        .then(results => {
          this.results = results.results;
          this.combinedListings = results.listings;
          this.combinedSales = results.sales;
          this.$store.commit('faveCards', []);
        })
        .catch(err => {
          this.$toast.open({
            type: 'is-danger',
            message: err.message
          });
        });
    },
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
        this.sortResults(this.cSort);
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
    sortResults: function(theSort) {
      const rev = theSort.hasOwnProperty('reverse') && theSort.reverse;
      if (this.view === 'combined') {
        this.combinedListings = theSort.sort(
          [...this.results.combinedListings],
          this.params.tags,
          rev
        );
        this.combinedSales = theSort.sort([...this.results.combinedSales], this.params.gs, rev);
      } else {
        const keys = Object.keys(this.results);
        keys.forEach(key => {
          this.results[key] = Sort.sortGrouped(
            this.results[key],
            theSort,
            rev,
            this.params.tags,
            this.params.gs,
            key
          );
        });
      }
    }
  },
  watch: {
    params: function(val) {
      this.runSearch(val);
    },
    reset: function() {
      this.resetHidden();
    },
    resetFaves: function() {
      this.resetFaveResults();
    },
    sortOption: function(val) {
      this.sortResults(val);
    },
    faveCards: function(val) {
      this.setFaves(val);
    },
    hiddenCards: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val && val.length) {
          const hiddenIds = val.map(i => i.id);
          const keys = Object.keys(this.results);
          if (keys && keys.length) {
            keys.forEach(key => {
              if (this.results && this.results[key] && this.results[key].length) {
                const newResult = this.results[key].map(item => {
                  item.hide = hiddenIds.indexOf(item.id) >= 0;
                  return item;
                });
                this.results[key] = newResult;
              }
            });
          }
          if (this.combinedListings && this.combinedListings.length) {
            const newListings = [...this.combinedListings].map(item => {
              item.hide = hiddenIds.indexOf(item.id) >= 0;
              return item;
            });
            this.combinedListings = newListings;
          }
          if (this.combinedSales && this.combinedSales.length) {
            const newSales = [...this.combinedSales].map(item => {
              item.hide = hiddenIds.indexOf(item.id) >= 0;
              return item;
            });
            this.combinedSales = newSales;
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.results-tab {
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
</style>
