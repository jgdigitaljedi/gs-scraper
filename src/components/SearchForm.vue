<template>
  <form class="search-form-form form"
    @submit.prevent="handleSubmit"
  >
    <b-field label="Area">
      <b-input v-model="searchForm.area"></b-input>
    </b-field>
    <b-field label="Listings Search Terms">
      <b-taginput
          v-model="searchForm.tags"
          ellipsis
          icon="label"
          placeholder="Add a listing term">
      </b-taginput>
    </b-field>
    <b-field label="Garage Sale Terms">
      <b-taginput
        v-model="searchForm.gs"
        ellipsis
        icon="label"
        placeholder="Add a sale term">
      </b-taginput>
    </b-field>
    <div class="search-form--options">
      <div class="search-form--options--listings">
        <h4>Listings</h4>
        <b-checkbox v-model="searchForm.cll">Craiglist</b-checkbox>
        <b-checkbox v-model="searchForm.lgl">LetGo</b-checkbox>
      </div>
      <div class="search-form--options--sales">
        <h4>Garage Sales</h4>
        <b-checkbox v-model="searchForm.cls">Craiglist</b-checkbox>
      </div>
    </div>
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
        area: 'Austin',
        gs: ['video games'],
        cll: true,
        cls: true,
        lgl: true
      }
    };
  },
  props: {
    msg: String
  },
  methods: {
    handleSubmit: function() {
      const { area, tags, gs, cll, cls, lgl } = this.searchForm;
      this.$emit('runSearch', { area, tags, gs, cll, cls, lgl });
    }
  }
};
</script>

/*eslint-disable */
<style lang="scss" scoped>
.search-form-form {
  padding: 1em;
  .field {
    margin-bottom: 1em;
  }
  input {
    width: 20px;
  }
  .search-form--options {
    div {
      margin-bottom: 1em;
      h4 {
        font-weight: bold;
      }
    }
  }
}
</style>
/*eslint-enable */
