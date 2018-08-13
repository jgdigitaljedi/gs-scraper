<template>
  <div class="result-card card">
    <div class="card-header">
      <div class="card-header--title">
        {{data.title}}
      </div>
      <div class="card-header--price">
        ${{data.price}}
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
        <div class="card-header--date">
          {{data.date}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResultCard',
  props: {
    data: Object
  },
  created() {
    if (this.data.hasOwnProperty('title') && this.data.title.length > 60) {
      const titleShortened = this.data.title.substr(0, 56);
      this.data.title = titleShortened + '...';
    }
  }
};
</script>

/*eslint-disable */
<style lang="scss" scoped>
@import '../styles/shadows.scss';
.result-card {
  @include box_shadow(2);
  padding: 1em;
  background-color: #fff;
  .card-header,
  .card-footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-weight: bold;
  }
  .card-header {
    height: 48px;
    .card-header--title {
      max-width: 35ch;
    }
  }
  .card-body--description {
    height: 144px;
  }
  .card-body--image {
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .card-header--price {
    color: green;
    font-size: 1.2em;
  }
}
</style>
/*eslint-enable */
