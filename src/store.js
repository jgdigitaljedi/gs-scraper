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
    faveCards: []
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
    faveCards: state => state.faveCards
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
      state.faveIds = fave;
    }
  },
  actions: {
    // Get data from server and send that to mutations to mutate the current state
  }
});
