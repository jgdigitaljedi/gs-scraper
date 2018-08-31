import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // Current state of the application lies here.
    searchTags: [],
    salesTags: [],
    showHiddenCards: false,
    hiddenCards: [],
    hiddenIds: [],
    faveIds: []
  },
  getters: {
    // Compute derived state based on the current state. More like computed property.
    searchTags: state => state.searchTags,
    salesTags: state => state.salesTags,
    showHiddenCards: state => state.showHiddenCards,
    hiddenIds: state => {
      return state.hiddenCards.map(item => item.id);
    },
    faveIds: state => state.faveIds,
    hiddenCards: state => state.hiddenCards
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
    hiddenCards(state, hidden) {
      console.log('hidden cards state updated', hidden);
      state.hiddenCards = hidden;
    },
    faveIds(state, fave) {
      state.faveIds = fave;
    }
  },
  actions: {
    // Get data from server and send that to mutations to mutate the current state
  }
});
