<template>

  <form class="search-form-form form"
    @submit.prevent="handleSubmit">

    <div class="search-form--area form-section">
      <b-field label="Area">
        <b-select placeholder="Select a city" v-model="searchForm.area">
          <option
            v-for="city in cities"
            :value="city"
            :key="city.id">
            {{ city.name }}
          </option>
        </b-select>
      </b-field>
      <b-checkbox v-model="searchForm.widen">Widen Search Area</b-checkbox>
    </div>

    <div class="search-form--listings form-section">
      <b-field label="Listings Search Terms">
        <b-taginput
            v-model="searchForm.tags"
            ellipsis
            icon="label"
            placeholder="Add a term">
        </b-taginput>
      </b-field>
      <div class="search-form--listings--options">
        <h4>Listing Sites</h4>
        <b-checkbox v-model="searchForm.cll">Craiglist</b-checkbox>
        <!-- <b-checkbox v-model="searchForm.lgl">LetGo</b-checkbox> -->
        <b-checkbox v-model="searchForm.oul">OfferUp</b-checkbox>
      </div>
    </div>

    <div class="search-form--sales form-section">
      <b-field label="Garage Sale Terms">
        <b-taginput
          v-model="searchForm.gs"
          ellipsis
          icon="label"
          placeholder="Add a term">
        </b-taginput>
      </b-field>
      <div class="search-form--options">
        <div class="search-form--options--sales">
          <h4>Garage Sale Sites</h4>
          <b-checkbox v-model="searchForm.cls">Craiglist</b-checkbox>
          <b-checkbox v-model="searchForm.ess">EstateSales</b-checkbox>
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
        oul: true,
        ess: true
      },
      cities: [
        {
          name: 'Austin',
          uri: 'austin',
          id: 'austin',
          lgKey: '0231301203311',
          clExtra: '',
          ouArea: 'Austin, TX',
          estateBounds: '30.341523_-97.530101'
        },
        {
          name: 'Fort Worth',
          uri: 'dallas',
          id: 'fortWorth',
          lgKey: '0231123213021',
          clExtra: 'ftw/',
          ouArea: 'Fort Worth, TX',
          estateBounds: '32.881522_-97.353032'
        },
        {
          name: 'Wichita Falls',
          uri: 'wichitafalls',
          id: 'wichitaFalls',
          lgKey: '0231122113130',
          clExtra: '',
          ouArea: 'Wichita Falls, TX',
          estateBounds: '33.787699_-98.532212'
        },
        {
          name: 'Vacaville',
          uri: 'sfbay',
          id: 'vacaville',
          lgKey: '0230102103202',
          clExtra: '',
          ouArea: 'Vacaville, CA',
          estateBounds: '38.415742_-122.010393'
        }
      ]
    };
  },
  props: {
    msg: String
  },
  methods: {
    handleSubmit: function() {
      const { area, tags, gs, cll, cls, lgl, oul, widen, ess } = this.searchForm;
      this.$store.commit('searchTags', tags);
      this.$store.commit('salesTags', gs);
      this.$emit('runSearch', { area, tags, gs, cll, cls, lgl, oul, widen, ess });
    }
  }
};
</script>

/*eslint-disable */
<style lang="scss" scoped>
@import '../styles/variables.scss';
.search-form-form {
  font-size: $smaller-font;
  padding: $large-gap;
  .field {
    margin-bottom: $large-gap;
  }
  input {
    width: 20px;
  }
  .form-section {
    padding: $large-gap 0;
    div {
      h4 {
        font-weight: bold;
      }
    }
  }
}
</style>
/*eslint-enable */
