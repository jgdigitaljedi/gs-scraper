<template>
  <section class="search-form-wrapper section">
    <b-field label="Area">
      <b-input value="Austin"></b-input>
    </b-field>
    <b-field label="Search Terms">
      <b-taginput
          v-model="tags"
          ellipsis
          icon="label"
          placeholder="Add a search term">
      </b-taginput>
    </b-field>
    <button class="button is-primary" v-on:click="$emit('runSearch', data)">
      <b-icon icon="search"></b-icon>
      <span>Search</span>
    </button>
  </section>
</template>

<script>
export default {
  name: 'SearchForm',
  data() {
    return {
      tags: ['video games', 'n64', 'nintendo', 'sega', 'atari']
    };
  },
  props: {
    msg: String
  }
};
</script>

<style lang="scss" scoped>
.search-form-wrapper {
  padding: 1em;
  input {
    width: 20px;
  }
}
</style>
