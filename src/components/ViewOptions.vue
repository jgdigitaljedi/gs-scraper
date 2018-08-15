<template>
  <section class="view-options">
    <h3>View Options</h3>
    <div class="field">
      <b-radio v-model="viewType"
        native-value="grouped">
          Grouped
      </b-radio>
    </div>
    <div class="field">
      <b-radio v-model="viewType"
        native-value="combined">
          Combined
      </b-radio>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ViewOptions',
  data() {
    return {
      viewType: String
    };
  },
  watch: {
    viewType: function() {
      this.$emit('viewChanged', this.viewType);
    }
  },
  created() {
    this.viewType = 'grouped';
    this.$emit('viewChanged', this.viewType);
  }
};
</script>

<style lang="scss" scoped>
.view-options {
  padding: 1em;
}
</style>
