import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // Current state of the application lies here.
    searchTags: [],
    salesTags: [],
    hiddenCards: [],
    hiddenIds: [],
    faveIds: [],
    faveCards: [],
    currentSort: null,
    allResults: {}
  },
  getters: {
    // Compute derived state based on the current state. More like computed property.
    searchTags: state => state.searchTags,
    salesTags: state => state.salesTags,
    hiddenIds: state => {
      return state.hiddenCards.map(item => item.id);
    },
    faveIds: state => {
      return state.faveCards.map(item => item.id);
    },
    hiddenCards: state => state.hiddenCards,
    faveCards: state => state.faveCards,
    currentSort: state => state.currentSort,
    currentHidden: state => {
      const hiddenIds = state.hiddenCards.map(item => item.id);
      const keys = Object.keys(state.allResults);
      const goodKeys = keys.filter(key => key.indexOf('combined') < 0);
      return [].concat.apply(
        [],
        goodKeys.map(key => {
          return state.allResults[key].filter(item => {
            return hiddenIds.indexOf(item.id) >= 0;
          });
        })
      );
    },
    // currentFaves: state => {
    //   const favesIds = this.faveIds;
    //   const
    // },
    allResults: state => state.allResults
  },
  mutations: {
    // Mutate the current state
    searchTags(state, tags) {
      state.searchTags = tags;
    },
    salesTags(state, tags) {
      state.salesTags = tags;
    },
    hiddenCards(state, hidden) {
      state.hiddenCards = hidden;
    },
    faveCards(state, fave) {
      state.faveCards = fave;
    },
    currentSort(state, cSort) {
      state.currentSort = cSort;
    },
    allResults(state, results) {
      state.allResults = results;
    }
  },
  actions: {
    // Get data from server and send that to mutations to mutate the current state
  }
});
