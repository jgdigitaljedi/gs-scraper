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
  </section>
</template>

<script>
import Sort from '../services/sort.service.js';
export default {
  name: 'ViewOptions',
  data() {
    return {
      viewType: String,
      sortSelected: String,
      sortOptions: Array
    };
  },
  watch: {
    viewType: function() {
      this.$emit('viewChanged', this.viewType);
    },
    sortSelected: function() {
      this.$emit('sortSelected', this.sortSelected);
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
.view-options {
  padding: 1em;
  .options-section {
    margin-bottom: 1em;
  }
}
</style>