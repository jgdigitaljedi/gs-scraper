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
      <button class="button is-danger" v-on:click="clearHidden">
        <b-icon icon="delete"></b-icon>
        <span>Reset Hidden</span>
      </button>
      <button class="button is-danger" v-on:click="clearFaves">
        <b-icon icon="delete"></b-icon>
        <span>Reset Faves</span>
      </button>
    </div>
  </section>
</template>

<script>
import Sort from '../services/sort.service.js';
// import Storage from '../services/storage.service.js';

export default {
  name: 'ViewOptions',
  data() {
    return {
      viewType: String,
      sortSelected: String,
      sortOptions: Array
    };
  },
  // computed: mapGetters(['showHiddenCards']),
  watch: {
    viewType: function() {
      this.$emit('viewChanged', this.viewType);
    },
    sortSelected: function() {
      this.$emit('sortSelected', this.sortSelected);
    }
  },
  methods: {
    clearHidden: function() {
      // Storage.clearHidden();
      this.$emit('clearHidden');
    },
    clearFaves: function() {
      // Storage.deleteAllFaves();
      // this.$store.commit('faveCards', []);
      this.$emit('clearFaves');
    }
  },
  created() {
    this.viewType = 'grouped';
    this.$emit('viewChanged', this.viewType);
    this.sortOptions = [
      { display: 'Price (low - high)', sort: Sort.sortByPrice },
      { display: 'Price (high - low)', sort: Sort.sortByPrice, reverse: true },
      { display: 'Date (desc)', sort: Sort.sortByDateDesc },
      { display: 'Date (asc)', sort: Sort.sortByDateAsc },
      { display: 'Relevance', sort: Sort.sortByRel }
    ];
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
}
</style>
