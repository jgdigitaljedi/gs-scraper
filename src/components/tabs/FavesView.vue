<template>
  <section class="faves-section">
    <div class="no-faves" v-if="(!favesResults || !favesResults.length) && (!favesSales || !favesSales.length)">
      <p>There are currently no favorited items to view!</p>
    </div>
    <CollapseResults v-if="favesResults &&  favesResults.length" :source="'Fave Results'" :dataArr="favesResults" :favesView="true" />
    <CollapseResults v-if="favesSales &&  favesSales.length" :source="'Fave Sales'" :dataArr="favesSales" :favesView="true" />
  </section>
</template>

<script>
import Storage from '../../services/storage.service.js';
import CollapseResults from '../CollapseResults';

export default {
  name: 'FavesView',
  components: {
    CollapseResults
  },
  data: function() {
    return {
      favesResults: Array,
      favesSales: []
    };
  },
  computed: {
    favesCards() {
      return this.$store.getters.faveCards;
    }
  },
  methods: {
    listingsAndSales: function(cards) {
      this.favesResults = cards.filter(item => {
        item.hide = false;
        item.favorite = true;
        if (item.type === 'garage sales') {
          this.favesSales.push(item);
        } else {
          return item;
        }
      });
    }
  },
  created() {
    this.favesSales = [];
    Storage.getFaveCards()
      .then(result => {
        this.$store.commit('faveCards', result.data.payload);
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
    favesCards: {
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
.faves-section {
  width: 100%;
  .no-faves {
    width: 100%;
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    p {
      font-style: italic;
    }
  }
}
</style>
