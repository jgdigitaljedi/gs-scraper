<template>
  <section class="collapsable">
    <b-collapse class="panel" :open.sync="isOpen">
      <div slot="trigger" class="panel-heading">
        <strong>{{source}}</strong>
      </div>
      <div class="panel-block">
        <ResultCard v-for="result in dataArr" :key="result.key" :data="result"/>
        <div class="btn-container">
          <button class="button is-primary" v-on:click="backToTop">
            <b-icon icon="arrow-up-bold"></b-icon>
            <span>Top of Section</span>
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
  methods: {
    backToTop: function() {
      const offset = this.$el.offsetTop;
      window.scrollTo({
        left: 0,
        top: offset,
        behavior: 'smooth'
      });
    }
  },
  data() {
    return {
      isOpen: false
    };
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
      }
    }
  }
}
</style>
