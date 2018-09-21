<template>
  <div class="toolbar-controls">
    <b-tooltip :label="toggleStr">
      <button class="button is-info" v-on:click="toggle" v-if="!showAll">
        <b-icon icon="eye"></b-icon>
        Show All
      </button>
      <button class="button is-info" v-on:click="toggle" v-if="showAll">
        <b-icon icon="eye-outline"></b-icon>
        Show Current
      </button>
    </b-tooltip>
    <b-tooltip :label="mergeStr">
      <button class="button is-warning" v-on:click="merge">
        <b-icon icon="source-merge"></b-icon>
        Merge {{buttonWhich}}
      </button>
    </b-tooltip>
    <b-tooltip :label="trimStr">
      <button class="button is-warning" v-on:click="isModalActive = true">
        <b-icon icon="content-cut"></b-icon>
        Trim {{buttonWhich}}
      </button>
    </b-tooltip>
    <b-tooltip :label="resetStr">
      <button class="button is-danger" v-on:click="reset">
        <b-icon icon="delete"></b-icon>
        Reset {{buttonWhich}}
      </button>
    </b-tooltip>

    <b-modal :active.sync="isModalActive" :width="500" scroll="keep">
      <div class="card trim-card">
        <div class="card-header">
          <span class="card-header-text">
            <b-icon icon="content-cut"></b-icon>
            Trim {{capitalize(which)}} Results
            <b-icon icon="content-cut" style="transform: scaleX(-1);"></b-icon>
          </span>
        </div>
        <div class="card-content">
          Remove results older than
          <b-input type="number" v-model="trimDays" class="trim-days"></b-input>
          days.
        </div>
        <div class="card-footer">
          <button class="button is-danger" v-on:click="trim">
            <b-icon icon="playlist-remove"></b-icon>
            Do it!
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import HiddenFaves from '../services/hiddenFaves.service.js';

export default {
  name: 'HFToolbar',
  props: {
    which: '',
    buttonWhich: '',
    showAll: false
  },
  data: function() {
    return {
      toggleStr: `Toggles between showing ${this.which} from current data and showing all ${
        this.which
      } in DB.`,
      mergeStr: `Makes all ${this.which} results match that of the current search data.`,
      trimStr: `Opens a modal asking for a # of days. Then will delete any ${
        this.which
      } results older than the # selected.`,
      resetStr: `Deletes all ${this.which} results both locally and on server.`,
      isModalActive: false,
      trimDays: 1
    };
  },
  methods: {
    toggle: function() {
      this.$emit('toggle');
    },
    merge: function() {
      // this.$emit('merge');
      HiddenFaves.merge(this.which);
    },
    trim: function() {
      HiddenFaves.trim(this.which, this.trimDays)
        .then(result => {
          console.log('trim result in toolbar vue', result);
          this.isModalActive = false;
          this.$emit('trim', result.data.results);
          this.$toast.open({
            type: 'is-success',
            message: `Your ${this.which} results have been trimmed by ${result.data.numberRemoved}!`
          });
        })
        .catch(error => {
          console.warn('trim error in tollbar vue', error);
          this.$toast.open({
            type: 'is-danger',
            message: `THERE WAS A PROBLEM TRIMMING YOUR ${this.which.toUpperCase()} RESULTS!`
          });
        });
    },
    reset: function() {
      this.$emit('reset');
    },
    capitalize: function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/theme.scss';
@import '../styles/shadows.scss';
.toolbar-controls {
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
    span.icon {
      margin-right: 0.5em !important;
    }
  }
  .trim-card {
    padding: 1em 2em;
    .card-header .card-header-text {
      font-size: 1.5em;
      font-weight: bold;
    }
    .card-content {
      display: flex;
      align-items: center;
      .trim-days {
        margin: 0 0.5em;
        width: 7ch;
      }
    }
    .card-footer {
      padding-top: 1em;
    }
  }
}
</style>