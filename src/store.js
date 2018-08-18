import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // Current state of the application lies here.
    searchTags: ['test', 'test2']
  },
  getters: {
    // Compute derived state based on the current state. More like computed property.
    searchTags: state => state.searchTags
  },
  mutations: {
    // Mutate the current state
    searchTags(state, tags) {
      state.searchTags = tags;
    }
  },
  actions: {
    // Get data from server and send that to mutations to mutate the current state
  }
});
