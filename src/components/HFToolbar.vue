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
      <button class="button is-warning" v-on:click="trim">
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
  </div>
</template>

<script>
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
      resetStr: `Deletes all ${this.which} results both locally and on server.`
    };
  },
  methods: {
    toggle: function() {
      this.$emit('toggle');
    },
    merge: function() {
      this.$emit('merge');
    },
    trim: function() {
      this.$emit('trim');
    },
    reset: function() {
      this.$emit('reset');
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
}
</style>