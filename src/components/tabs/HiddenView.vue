<template>
  <section class="hidden-section">
    <h4>Item Listings</h4>
    <CollapseResults v-if="hiddenResults &&  hiddenResults.length > 1" :source="'Hidden Results'" :dataArr="hiddenResults" :hiddenView="true" />
    <CollapseResults v-if="hiddenSales &&  hiddenSales.length > 1" :source="'Hidden Sales'" :dataArr="hiddenSales" :hiddenView="true" />
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
  data: function() {
    return {
      hiddenResults: Array,
      hiddenSales: Array
    };
  },
  created() {
    console.log('hidden view created');
    this.hiddenSales = [];
    Storage.getHiddenCards()
      .then(result => {
        console.log('result', result);
        this.hiddenResults = Array.from(result.data.payload).filter(item => {
          item.hide = true;
          if (item.type === 'garage sales') {
            this.hiddenSales.push(item);
          } else {
            return item;
          }
        });
        console.log('hiddenResults', this.hiddenResults);
        console.log('hiddenSales', this.hiddenSales);
      })
      .catch(err => {
        console.log('hidden view get error', err);
        this.$toast.open({
          type: 'is-danger',
          message: err.message
        });
      });
  }
};
</script>

<style lang="scss" scoped>
.hidden-section {
  width: 100%;
}
</style>
