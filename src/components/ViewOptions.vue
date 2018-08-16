<template>
  <section class="view-options">
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

    <b-field label="Sort By:" class="combined-sort" v-if="viewType === 'combined'">
      <b-select placeholder="Sort options" v-model="sortSelected">
        <option
          v-for="option in sortOptions"
          :value="option"
          :key="option.display">
          {{ option.display }}
        </option>
      </b-select>
    </b-field>
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
      console.log('sort', this.sortSelected);
      this.$emit('sortSelected', this.sortSelected);
    }
  },
  created() {
    this.viewType = 'grouped';
    this.$emit('viewChanged', this.viewType);
    this.sortOptions = [{ display: 'Price', sort: Sort.sortByPrice }];
  }
};
</script>

<style lang="scss" scoped>
.view-options {
  padding: 1em;
}
</style>
