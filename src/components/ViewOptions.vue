<template>
  <section class="view-options">
    <div class="view-options--options options-section">
      <h3>View Options</h3>
      <div class="field">
        <b-radio v-model="viewType"
          native-value="grouped">
            Grouped
        </b-radio>
      </div>
      <div class="field">
        <b-radio v-model="viewType"
          native-value="combined">
            Combined
        </b-radio>
      </div>
    </div>

    <div class="view-options--sort options-section">
      <b-field label="Sort By:" class="combined-sort">
        <b-select placeholder="Sort options" v-model="sortSelected">
          <option
            v-for="option in sortOptions"
            :value="option"
            :key="option.display">
            {{ option.display }}
          </option>
        </b-select>
      </b-field>
    </div>

    <div class="view-options--show-hidden options-section">
      <button class="button is-danger" v-on:click="clearHidden" v-if="tab === 2">
        <b-icon icon="delete"></b-icon>
        <span>Reset Hidden</span>
      </button>
      <button class="button is-danger" v-on:click="clearFaves" v-if="tab === 1">
        <b-icon icon="delete"></b-icon>
        <span>Reset Faves</span>
      </button>
      <div class="price-check-form" v-if="tab === 0">
        <b-input input v-model="priceTerm" placeholder="Price Check Search Terms"></b-input>
        <button class="button is-danger" v-on:click="openPriceCheck">
          <b-icon icon="cash-usd"></b-icon>
          <span>Price Check</span>
        </button>
      </div>
    </div>

    <b-modal :active.sync="isModalActive" class="price-check-modal">
      <div class="card">
        <div class="card-header">
          {{priceTerm}}
        </div>
        <div class="card-content" v-if="modalData">
          <div><b>Average Price:</b> ${{modalData.average.toFixed(2)}}</div>
          <div><b>Highest Price:</b> ${{modalData.highest.toFixed(2)}}</div>
          <div><b>Lowest Price:</b> ${{modalData.lowest.toFixed(2)}}</div>
          <div><b># of Results:</b> {{modalData.results}}</div>
          <hr>
          <div class="ebay-link">
            Don't like the local prices? Click the link to open the eBay search in a new tab and buy it there instead.<br>
            <a target="__blank" :href="modalData.link">View On eBay</a>
          </div>
        </div>
      </div>
    </b-modal>
  </section>
</template>

<script>
import Sort from '../services/sort.service.js';
import PriceCheck from '../services/priceCheck.service.js';

export default {
  name: 'ViewOptions',
  props: {
    tab: Number
  },
  data() {
    return {
      viewType: String,
      sortSelected: String,
      sortOptions: Array,
      priceTerm: '',
      isModalActive: false,
      modalData: null
    };
  },
  watch: {
    viewType: function() {
      this.$emit('viewChanged', this.viewType);
    },
    sortSelected: function() {
      this.$store.commit('currentSort', this.sortSelected);
      this.$emit('sortSelected', this.sortSelected);
    },
    tab: function(val) {
      console.log('A TAB', val);
    }
  },
  methods: {
    clearHidden: function() {
      this.$emit('clearHidden');
    },
    clearFaves: function() {
      this.$emit('clearFaves');
    },
    openPriceCheck: function() {
      console.log('search then open price check modal');
      PriceCheck.check(this.priceTerm)
        .then(result => {
          console.log('RESULT', result);
          if (result && !result.error) {
            // open modal with data stuff
            this.modalData = result;
            this.isModalActive = true;
          }
        })
        .catch(err => {
          console.warn('ERROR', err);
          this.$toast.open({
            type: 'is-danger',
            message: 'ERROR LOOKING UP PRICE!'
          });
        });
    }
  },
  created() {
    this.viewType = 'grouped';
    this.$emit('viewChanged', this.viewType);
    this.sortOptions = [
      { display: 'Date (desc)', sort: Sort.sortByDateDesc },
      { display: 'Date (asc)', sort: Sort.sortByDateAsc },
      { display: 'Price (low - high)', sort: Sort.sortByPrice },
      { display: 'Price (high - low)', sort: Sort.sortByPrice, reverse: true },
      { display: 'Relevance', sort: Sort.sortByRel }
    ];
    this.sortSelected = this.sortOptions[0];
    this.$store.commit('currentSort', this.sortSelected);
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';
.view-options {
  padding: $large-gap;
  font-size: $smaller-font;
  .options-section {
    margin-bottom: $large-gap;
  }
  .view-options--show-hidden {
    display: flex;
    flex-direction: column;
    h4 {
      font-weight: bold;
      margin-bottom: 0.9em;
    }
    button {
      margin-top: $standard-gap;
    }
  }
  .price-check-modal {
    padding: 2em;
    .card-header {
      width: 100%;
      display: flex;
      justify-content: center;
      font-size: 2em;
      font-weight: bold;
    }
    .card-content {
      display: flex;
      align-items: center;
      flex-direction: column;
      font-size: 1.2em;
      .ebay-link {
        text-align: center;
        font-size: 1em;
      }
    }
  }
}
</style>
