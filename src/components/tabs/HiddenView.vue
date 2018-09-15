<template>
  <section class="hidden-section">
    <HFToolbar :showAll="showAll" :which="'hidden'" :buttonWhich="'Hidden'" v-on:toggle="toggleHidden" v-on:merge="mergeHidden" v-on:trim="trimHidden" v-on:reset="resetHidden" />
    <CollapseResults v-if="hiddenResults &&  hiddenResults.length" :source="'Hidden Results'" :dataArr="hiddenResults" :hiddenView="true" />
    <CollapseResults v-if="hiddenSales &&  hiddenSales.length" :source="'Hidden Sales'" :dataArr="hiddenSales" :hiddenView="true" />
  </section>
</template>

<script>
import Storage from '../../services/storage.service.js';
import CollapseResults from '../CollapseResults';
import HFToolbar from '../HFToolbar';
import HiddenFaves from '../../services/hiddenFaves.service.js';
// import AppLogic from '../../services/appLogic.service.js';

export default {
  name: 'HiddenView',
  components: {
    CollapseResults,
    HFToolbar
  },
  data: function() {
    return {
      hiddenResults: Array,
      hiddenSales: [],
      showAll: false
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
    resetHidden: function() {
      HiddenFaves.reset('hidden')
        .then(result => {
          const keys = Object.keys(result);
          keys.forEach(key => {
            result[key].forEach(item => {
              item.hide = false;
            });
          });
          this.$store.commit('allResults', result);
          this.$store.commit('hiddenCards', []);
          this.$toast.open({
            type: 'is-success',
            message: 'Hidden were successfully reset!'
          });
        })
        .catch(err => {
          this.$toast.open({
            type: 'is-danger',
            message: err.message
          });
          console.warn(err.code);
        });
    },
    trimHidden: function() {
      // meant to open a modal that asks for how many days to keep then makes server call to remove any hidden past a certain date
      // this will help prevent having tons of hidden server side that are too old to be useful anymore
      console.log('trimming hidden');
    },
    mergeHidden: function() {
      // meant to update all hidden locally ond on server to be equal to current hidden
      console.log('merging hidden');
    },
    toggleHidden: function() {
      this.showAll = !this.showAll;
      if (this.showAll) {
        this.listingsAndSales(this.hiddenCards);
      } else {
        this.listingsAndSales(this.currentHidden);
      }
    },
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
