<template>
  <section class="hidden-section">
    <div class="hidden-extra-controls">
      <b-tooltip label="Toggles between showing hidden from current data and showing all hidden in DB.">
        <button class="button is-info" v-on:click="toggleHidden" v-if="!showAll">
          <b-icon icon="eye"></b-icon>
          Show All
        </button>
        <button class="button is-info" v-on:click="toggleHidden" v-if="showAll">
          <b-icon icon="eye-outline"></b-icon>
          Show Current
        </button>
      </b-tooltip>
      <b-tooltip label="Makes all hidden results match that of the current search data.">
        <button class="button is-warning" v-on:click="mergeHidden">
          <b-icon icon="source-merge"></b-icon>
          Merge Hidden
        </button>
      </b-tooltip>
      <b-tooltip label="Opens a modal asking for a # of days. Then will delete any hidden results older than the # selected.">
        <button class="button is-warning" v-on:click="trimHidden">
          <b-icon icon="content-cut"></b-icon>
          Trim Hidden
        </button>
      </b-tooltip>
      <b-tooltip label="Deletes all hidden results both locally and on server.">
        <button class="button is-danger" v-on:click="resetHidden">
          <b-icon icon="delete"></b-icon>
          Reset Hidden
        </button>
      </b-tooltip>
    </div>
    <CollapseResults v-if="hiddenResults &&  hiddenResults.length" :source="'Hidden Results'" :dataArr="hiddenResults" :hiddenView="true" />
    <CollapseResults v-if="hiddenSales &&  hiddenSales.length" :source="'Hidden Sales'" :dataArr="hiddenSales" :hiddenView="true" />
  </section>
</template>

<script>
import Storage from '../../services/storage.service.js';
import CollapseResults from '../CollapseResults';
// import HiddenFaves from '../../services/hiddenFaves.service.js';
// import AppLogic from '../../services/appLogic.service.js';

export default {
  name: 'HiddenView',
  components: {
    CollapseResults
  },
  data: function() {
    return {
      hiddenResults: Array,
      hiddenSales: [],
      showAll: false
    };
  },
  computed: {
    hiddenCards() {
      return this.$store.getters.hiddenCards;
    },
    currentHidden() {
      return this.$store.getters.currentHidden;
    }
  },
  methods: {
    resetHidden: function() {
      // this will replace the reset hidden button in the view options area; this is better UI maybe?
      console.log('reset hidden');
    },
    trimHidden: function() {
      // meant to open a modal that asks for how many days to keep then makes server call to remove any hidden past a certain date
      // this will help prevent having tons of hidden server side that are too old to be useful anymore
      console.log('trimming hidden');
    },
    mergeHidden: function() {
      // meant to update all hidden locally ond on server to be equal to current hidden
      console.log('merging hidden');
    },
    toggleHidden: function() {
      this.showAll = !this.showAll;
      if (this.showAll) {
        this.listingsAndSales(this.hiddenCards);
      } else {
        this.listingsAndSales(this.currentHidden);
      }
    },
    listingsAndSales: function(cards) {
      this.hiddenResults = cards.filter(item => {
        item.hide = true;
        if (item.type === 'garage sales') {
          this.hiddenSales.push(item);
        } else {
          return item;
        }
      });
    }
  },
  created() {
    console.log('currentHidden', this.currentHidden);
    console.log('hiddenCards', this.hiddenCards);
    this.hiddenSales = [];
    Storage.getHiddenCards()
      .then(result => {
        this.$store.commit('hiddenCards', result.data.payload);
        this.listingsAndSales(result.data.payload);
      })
      .catch(err => {
        this.$toast.open({
          type: 'is-danger',
          message: err.message
        });
      });
  },
  watch: {
    hiddenCards: {
      immediate: true,
      deep: true,
      handler(val) {
        this.listingsAndSales(val);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/theme.scss';
@import '../../styles/shadows.scss';
.hidden-section {
  width: 100%;
  .hidden-extra-controls {
    padding: 1em;
    border-bottom: 2px solid $warning;
    background-color: $light;
    text-align: center;
    .button {
      margin: 0 0.5em;
      @include box_shadow(2);
      transition: box-shadow 0.2s ease-out;
      &:hover {
        @include box_shadow(3);
      }
      &:active {
        @include box_shadow(1);
      }
      .icon {
        margin-right: 0.5em;
      }
    }
  }
}
</style>
