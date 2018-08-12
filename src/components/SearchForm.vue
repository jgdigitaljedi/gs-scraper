<template>
  <form class="search-form-form form"
    @submit.prevent="handleSubmit"
  >
    <b-field label="Area">
      <b-input v-model="searchForm.area"></b-input>
    </b-field>
    <b-field label="Search Terms">
      <b-taginput
          v-model="searchForm.tags"
          ellipsis
          icon="label"
          placeholder="Add a search term">
      </b-taginput>
    </b-field>
    <button class="button is-primary" type="submit">
      <b-icon icon="search-web"></b-icon>
      <span>Search</span>
    </button>
  </form>
</template>

<script>
export default {
  name: 'SearchForm',
  data() {
    return {
      searchForm: {
        tags: ['nintendo'],
        area: 'Austin'
      }
    };
  },
  props: {
    msg: String
  },
  methods: {
    handleSubmit: function() {
      const { area, tags } = this.searchForm;
      this.$emit('runSearch', { area, tags });
    }
  }
};
</script>

<style lang="scss" scoped>
.search-form-form {
  padding: 1em;
  .field {
    margin-bottom: 1em;
  }
  input {
    width: 20px;
  }
}
</style>
