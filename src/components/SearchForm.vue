<template>

  <form class="search-form-form form"
    @submit.prevent="handleSubmit">

    <b-field label="Area" class="search-from--area">
      <b-select placeholder="Select a city" v-model="searchForm.area">
        <option
          v-for="city in cities"
          :value="city"
          :key="city.id">
          {{ city.name }}
        </option>
      </b-select>
    </b-field>

    <div class="search-form--listings">
      <b-field label="Listings Search Terms">
        <b-taginput
            v-model="searchForm.tags"
            ellipsis
            icon="label"
            placeholder="Add a listing term">
        </b-taginput>
      </b-field>
      <div class="search-form--listings--options">
        <h4>Listing Sites</h4>
        <b-checkbox v-model="searchForm.cll">Craiglist</b-checkbox>
        <!-- <b-checkbox v-model="searchForm.lgl">LetGo</b-checkbox> -->
        <b-checkbox v-model="searchForm.oul">OfferUp</b-checkbox>
      </div>
    </div>

    <div class="search-form--sales">
      <b-field label="Garage Sale Terms">
        <b-taginput
          v-model="searchForm.gs"
          ellipsis
          icon="label"
          placeholder="Add a sale term">
        </b-taginput>
      </b-field>
      <div class="search-form--options">
        <div class="search-form--options--sales">
          <h4>Garage Sale Sites</h4>
          <b-checkbox v-model="searchForm.cls">Craiglist</b-checkbox>
        </div>
      </div>
    </div>

    <div class="search-form--actions">
      <button class="button is-primary" type="submit" :disabled="!searchForm.area">
        <b-icon icon="search-web"></b-icon>
        <span>Search</span>
      </button>
    </div>

  </form>

</template>

<script>
export default {
  name: 'SearchForm',
  data() {
    return {
      searchForm: {
        tags: ['nintendo'],
        area: null,
        gs: ['games'],
        cll: true,
        cls: true,
        lgl: true,
        oul: true
      },
      cities: [
        {
          name: 'Austin',
          uri: 'austin',
          id: 'austin',
          lgKey: '0231301203311',
          clExtra: '',
          ouArea: 'Austin, TX'
        },
        {
          name: 'Fort Worth',
          uri: 'dallas',
          id: 'fortWorth',
          lgKey: '0231123213021',
          clExtra: 'ftw/',
          ouArea: 'Fort Worth, TX'
        },
        {
          name: 'Wichita Falls',
          uri: 'wichitafalls',
          id: 'wichitaFalls',
          lgKey: '0231122113130',
          clExtra: '',
          ouArea: 'Wichita Falls, TX'
        },
        {
          name: 'Vacaville',
          uri: 'sfbay',
          id: 'vacaville',
          lgKey: '0230102103202',
          clExtra: '',
          ouArea: 'Vacaville, CA'
        }
      ]
    };
  },
  props: {
    msg: String
  },
  methods: {
    handleSubmit: function() {
      const { area, tags, gs, cll, cls, lgl, oul } = this.searchForm;
      this.$store.commit('searchTags', tags);
      this.$store.commit('salesTags', gs);
      this.$emit('runSearch', { area, tags, gs, cll, cls, lgl, oul });
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
  .search-form--listings,
  .search-form--sales,
  .search-form--area,
  .search-form--actions {
    padding: 1em 0;
    div {
      h4 {
        font-weight: bold;
      }
    }
  }
}
</style>
/*eslint-enable */
