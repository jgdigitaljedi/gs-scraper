import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // Current state of the application lies here.
    searchTags: [],
    salesTags: [],
    showHiddenCards: false
  },
  getters: {
    // Compute derived state based on the current state. More like computed property.
    searchTags: state => state.searchTags,
    salesTags: state => state.salesTags,
    showHiddenCards: state => state.showHiddenCards
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
      console.log('state hidden', show);
      state.showHiddenCards = show;
    }
  },
  actions: {
    // Get data from server and send that to mutations to mutate the current state
  }
});
