<template>
  <section class="hidden-section">
    <CollapseResults v-if="hiddenResults &&  hiddenResults.length" :source="'Hidden Results'" :dataArr="hiddenResults" :hiddenView="true" />
    <CollapseResults v-if="hiddenSales &&  hiddenSales.length" :source="'Hidden Sales'" :dataArr="hiddenSales" :hiddenView="true" />
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
      hiddenSales: []
    };
  },
  computed: {
    hiddenCards() {
      return this.$store.getters.hiddenCards;
    },
    currentHidden() {
      return this.$store.getters.currentHidden;
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
    console.log('currentHidden', this.currentHidden);
    console.log('hiddenCards', this.hiddenCards);
    this.hiddenSales = [];
    Storage.getHiddenCards()
      .then(result => {
        this.$store.commit('hiddenCards', result.data.payload);
        this.listingsAndSales(result.data.payload);
      })
      .catch(err => {
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
