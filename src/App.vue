<template>
  <div id="app">
    <button class="button hide-icon is-info" v-on:click="hideSidebar = !hideSidebar">
      <b-icon v-if="!hideSidebar" icon="eye-off"></b-icon>
      <b-icon v-if="hideSidebar" icon="eye"></b-icon>
    </button>
    <div class="sidebar" :class="{'hidden': hideSidebar}">
      <SearchForm msg="test" v-on:runSearch="runSearch" class="sidebar"/>
      <hr>
      <ViewOptions v-on:viewChanged="viewChanged" v-on:sortSelected="sortResults" v-on:clearHidden="resetHidden" v-on:clearFaves="resetFaveResults"/>
    </div>
    <b-tabs v-model="activeTab" class="app--tabs">
      <b-tab-item label="Search" class="app--tabs--tab">
        <SearchView :params="searchParams" :reset="resetHides" :resetFaves="resetFaves" :view="viewSelected" :sortOption="sortOption" />
      </b-tab-item>
      <b-tab-item label="Faves" class="app--tabs--tab">
        <FavesView v-if="activeTab === 1" />
      </b-tab-item>
      <b-tab-item label="Hidden" class="app--tabs--tab">
        <HiddenView v-if="activeTab === 2" />
      </b-tab-item>
    </b-tabs>
    <back-to-top visibleoffset="500">
      <button class="button is-info">
        <b-icon icon="chevron-double-up"></b-icon>
        <span>&nbsp; Top</span>
      </button>
    </back-to-top>
  </div>
</template>

<script>
import SearchForm from './components/SearchForm';
import CollapseResults from './components/CollapseResults';
import ViewOptions from './components/ViewOptions';
import { mapGetters } from 'vuex';
import BackToTop from 'vue-backtotop';
import SearchView from './components/tabs/SearchView';
import HiddenView from './components/tabs/HiddenView';
import FavesView from './components/tabs/FavesView';
import Storage from './services/storage.service.js';
// import { mapState } from 'vuex';

export default {
  name: 'app',
  components: {
    SearchForm,
    CollapseResults,
    ViewOptions,
    BackToTop,
    SearchView,
    HiddenView,
    FavesView
  },
  data: function() {
    return {
      searchRan: Boolean,
      viewSelected: String,
      hideSidebar: Boolean,
      activeTab: Number,
      searchParams: Object,
      resetHides: Date,
      sortOption: Object,
      resetFaves: Date
    };
  },
  computed: mapGetters(['searchTags', 'salesTags']),
  methods: {
    resetHidden: function() {
      this.resetHides = new Date();
    },
    resetFaveResults: function() {
      this.resetFaves = new Date();
    },
    runSearch: function(search) {
      this.searchParams = search;
    },
    viewChanged: function(viewType) {
      this.viewSelected = viewType;
    },
    sortResults: function(theSort) {
      this.sortOption = theSort;
    }
  },
  created() {
    this.results = {
      cll: null,
      cls: null,
      lgl: null,
      oul: null
    };
    this.hideSidebar = false;
    this.activeTab = 0;
    Storage.getHiddenCards()
      .then(result => {
        console.log('hidden result in app', result);
        if (!result.data.error) {
          this.$store.commit('hiddenCards', result.data.payload);
        }
      })
      .catch(err => {
        console.error(err);
        this.$toast.open(err.message);
      });
    Storage.getFaveCards()
      .then(result => {
        console.log('fave result in app', result);
        if (!result.data.error) {
          this.$store.commit('faveCards', result.data.payload);
        }
      })
      .catch(err => {
        console.error(err);
        this.$toast.open(err.message);
      });
  }
};
</script>

/*eslint-disable */
<style lang="scss">
@import './styles/theme.scss';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding-top: 30px;
  background-color: #fafafa;
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  width: 100%;
  .app--tabs {
    width: 100%;
    .app--tabs--tab {
      width: 100%;
    }
  }
  .hide-button {
    top: 0;
    left: 0;
    position: absolute;
    z-index: 10;
  }
  .sidebar {
    min-width: 300px;
    border-right: 1px solid #ccc;
    transition: all 0.5s;
    &.hidden {
      transform: translateX(-100%);
      width: 0;
      display: none;
    }
    .view-options {
      padding: 1em;
      h3 {
        font-weight: bold;
        margin-bottom: 1em;
      }
    }
  }
}
</style>
/*eslint-enable */
