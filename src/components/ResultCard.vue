<template>
  <div class="result-card card">
    <div class="card-header">
      <div class="card-header--title">
        {{data.title}}
      </div>
      <div class="card-header--date">
        {{data.date}}
      </div>
    </div>
    <div class="card-body">
      <div class="card-body--image card-image" v-if="data.image">
        <img :src="data.image"/>
      </div>
      <div class="card-body--description">
        {{data.description}}
      </div>
      <div class="card-footer">
        <a target="__blank" :href="data.link">Link</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResultCard',
  props: {
    data: Object
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/shadows.scss';
.result-card {
  @include box_shadow(2);
  padding: 1em;
  background-color: #fff;
  .card-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
