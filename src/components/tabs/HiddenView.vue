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
  computed: {
    hiddenCards() {
      return this.$store.getters.hiddenCards;
    }
  },
  methods: {
    listingsAndSales: function(cards) {
      this.hiddenResults = cards.filter(item => {
        item.hide = true;
        if (item.type === 'garage sales') {
          this.hiddenSales.push(item);
        } else {
          return item;
        }
      });
    }
  },
  created() {
    this.hiddenSales = [];
    Storage.getHiddenCards()
      .then(result => {
        console.log('result', result);
        this.$store.commit('hiddenCards', result.data.payload);
        this.listingsAndSales(result.data.payload);
      })
      .catch(err => {
        console.log('hidden view get error', err);
        this.$toast.open({
          type: 'is-danger',
          message: err.message
        });
      });
  },
  watch: {
    hiddenCards: {
      immediate: true,
      deep: true,
      handler(val) {
        this.listingsAndSales(val);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.hidden-section {
  width: 100%;
}
</style>
