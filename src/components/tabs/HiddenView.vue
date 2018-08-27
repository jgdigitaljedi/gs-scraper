<template>
  <section class="hidden-section">
    <h4>Item Listings</h4>
    <CollapseResults v-if="hiddenResults &&  hiddenResults.length > 1" :source="'Hidden Results'" :dataArr="hiddenResults"/>
  </section>
</template>

<script>
import Storage from '../../services/storage.service.js';
import CollapseResults from '../CollapseResults';

export default {
  name: 'HiddenView',
  components: {
    CollapseResults
  },
  props: {},
  data: function() {
    return {
      hiddenResults: Array,
      hiddenSales: Array
    };
  },
  created() {
    // this.hiddenResults = Storage.getHiddenCards();
    console.log('hiddenResults', this.hiddenResults);
  }
};
</script>

<style lang="scss" scoped>
.hidden-section {
  width: 100%;
}
</style>
