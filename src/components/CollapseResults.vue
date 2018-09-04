<template>
  <section class="collapsable">
    <b-collapse class="panel" :open.sync="isOpen">
      <div slot="trigger" class="panel-heading">
        <strong>{{source}}</strong>
      </div>
      <div class="panel-block">
        <ResultCard v-for="result in cardArr" :key="result.key" :cardData="result" v-on:hideCardAction="hideCard"
          v-on:faveCardAction="faveCard" v-if="!result.hide || hiddenView"/>
        <div class="btn-container">
          <button class="button is-primary" v-on:click="backToTop">
            <b-icon icon="arrow-up-bold"></b-icon>
            <span>Top of Section</span>
          </button>
          <button class="button is-info" v-on:click="isOpen = false">
            <b-icon icon="close-outline"></b-icon>
            <span>Close Section</span>
          </button>
        </div>
      </div>
    </b-collapse>
  </section>
</template>

<script>
import ResultCard from './ResultCard';
import { mapGetters } from 'vuex';

export default {
  name: 'CollapseResults',
  components: { ResultCard },
  props: {
    source: String,
    dataArr: Array,
    hiddenView: Boolean
  },
  computed: {
    ...mapGetters({
      showAll: 'showHiddenCards'
    })
  },
  data: function() {
    return {
      cardArr: [],
      isOpen: false
    };
  },
  created() {
    this.cardArr = this.dataArr;
  },
  methods: {
    backToTop: function() {
      const offset = this.$el.offsetTop;
      window.scrollTo({
        left: 0,
        top: offset,
        behavior: 'smooth'
      });
    },
    faveCard(cards) {
      console.log('cards', cards);
      const favesId = cards.map(item => item.id);
      const newDataArr = [...this.cardArr].map(item => {
        console.log('item', item);
        if (favesId.indexOf(item.id) >= 0) {
          item.hide = false;
          item.favorite = true;
        }
        return item;
      });
      // const newDataArr = [...this.cardArr].map(item => {
      //   if (item.id === card.id) {
      //     item.hide = false;
      //     item.favorite = true;
      //   }
      //   return item;
      // });
      this.cardArr = newDataArr;
    },
    hideCard(card) {
      const newDataArr = [...this.cardArr].map(item => {
        if (item.id === card.id) {
          item.hide = true;
          item.favorite = false;
        }
        return item;
      });
      this.cardArr = newDataArr;
    }
  },
  watch: {
    dataArr: function(val) {
      this.cardArr = val;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/variables.scss';
.collapsable {
  .panel {
    .panel-block {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      .result-card {
        max-width: 400px;
        margin: $large-gap;
      }
      .btn-container {
        width: 100%;
        border-top: 1px solid #ccc;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: $standard-gap;
        .is-info {
          margin-left: $large-gap;
        }
      }
    }
  }
}
</style>
