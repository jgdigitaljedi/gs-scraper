<template>
  <div id="app">
    <SearchForm msg="test" v-on:runSearch="runSearch"/>
  </div>
</template>

<script>
import SearchForm from './components/SearchForm';

export default {
  name: 'app',
  components: {
    SearchForm
  },
  methods: {
    runSearch: data => {
      console.log('run search', data);
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
