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
        <div class="search-form--listings--options--checkboxes">
          <b-checkbox v-model="searchForm.lgl">LetGo</b-checkbox>
          <b-checkbox v-model="searchForm.cll">Craigslist</b-checkbox>
          <b-checkbox v-model="searchForm.oul">OfferUp</b-checkbox>
          <b-checkbox v-model="searchForm.ood">Oodle</b-checkbox>
          <b-checkbox v-model="searchForm.vsl">VarageSale</b-checkbox>
        </div>
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
      <button class="button is-primary" type="submit" :disabled="searchDisabled">
        <b-icon icon="search-web"></b-icon>
        <span>Search</span>
      </button>
    </div>

  </form>

</template>

<script>
import Locations from '../services/location.service.js';

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
        ess: true,
        ood: true,
        vsl: true
      },
      cities: Locations.locations(),
      listingsKeys: ['cll', 'oul', 'ood', 'vsl'],
      salesKeys: ['cls', 'ess'],
      searchDisabled: true
    };
  },
  props: {
    msg: String
  },
  methods: {
    handleSubmit: function() {
      const { area, tags, gs, cll, cls, lgl, oul, widen, ess, ood, vsl } = this.searchForm;
      this.$store.commit('searchTags', tags);
      this.$store.commit('salesTags', gs);
      this.$emit('runSearch', { area, tags, gs, cll, cls, lgl, oul, widen, ess, ood, vsl });
    }
  },
  watch: {
    searchForm: {
      handler(val) {
        let listingsValid, salesValid;
        const areaValid = !!val.area;

        const numListings = this.listingsKeys.filter(key => val[key]);
        if (numListings && numListings.length) {
          listingsValid = val.tags && val.tags.length ? true : false;
        } else {
          listingsValid = true;
        }

        const numSales = this.salesKeys.filter(key => val[key]);
        if (numSales && numSales.length) {
          salesValid = val.gs && val.gs.length ? true : false;
        } else {
          salesValid = true;
        }

        this.searchDisabled = !(listingsValid && salesValid && areaValid);
      },
      deep: true
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
    .search-form--listings--options--checkboxes {
      display: flex;
      flex-wrap: wrap;
      .b-checkbox.checkbox {
        margin: 0.2em 0 0 0.5em;
      }
    }
  }
}
</style>
/*eslint-enable */
