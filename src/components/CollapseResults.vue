<template>
  <section class="collapsable">
    <b-collapse class="panel" :open.sync="isOpen">
      <div slot="trigger" class="panel-heading">
        <strong>{{source}}</strong>
      </div>
      <div class="panel-block">
        <ResultCard v-for="result in cardArr" :key="result.key" :cardData="result" v-on:hideCardAction="hideCard" v-if="!result.hide"/>
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
export default {
  name: 'CollapseResults',
  components: { ResultCard },
  props: {
    source: String,
    dataArr: Array
  },
  data: function() {
    return {
      cardArr: []
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
    hideCard(card) {
      const newDataArr = [...this.cardArr].map(item => {
        if (item.id === card.id) {
          item.hide = true;
        }
        return item;
      });
      this.cardArr = newDataArr;
      console.log('cardArr', this.cardArr);
    }
  },
  data() {
    return {
      isOpen: false
    };
  },
  watch: {
    dataArr: function(val, oldVal) {
      this.cardArr = val;
      // console.log('val', val);
      // console.log('oldVal', oldVal);
    }
  }
};
</script>

<style lang="scss" scoped>
.collapsable {
  .panel {
    .panel-block {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      .result-card {
        max-width: 400px;
        margin: 1em;
      }
      .btn-container {
        width: 100%;
        border-top: 1px solid #ccc;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5em;
        .is-info {
          margin-left: 1em;
        }
      }
    }
  }
}
</style>
