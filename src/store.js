import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // Current state of the application lies here.
    searchTags: [],
    salesTags: [],
    showHiddenCards: false,
    hiddenIds: [],
    faveIds: []
  },
  getters: {
    // Compute derived state based on the current state. More like computed property.
    searchTags: state => state.searchTags,
    salesTags: state => state.salesTags,
    showHiddenCards: state => state.showHiddenCards,
    hiddenIds: state => state.hiddenIds,
    faveIds: state => state.faveIds
  },
  mutations: {
    // Mutate the current state
    searchTags(state, tags) {
      state.searchTags = tags;
    },
    salesTags(state, tags) {
      state.salesTags = tags;
    },
    showHiddenCards(state, show) {
      state.showHiddenCards = show;
    },
    hiddenIds(state, hidden) {
      state.hiddenIds = hidden;
    },
    faveIds(state, fave) {
      state.faveIds = fave;
    }
  },
  actions: {
    // Get data from server and send that to mutations to mutate the current state
  }
});
