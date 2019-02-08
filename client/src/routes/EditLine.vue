<template>
  <div id="editLine">LINE {{orderLine.lineNumber}}</div>
</template>

<script>
export default {
  name: "EditLine",
  data() {
    return {
      index: this.$route.params.index
    };
  },
  computed: {
    orderLine() {
      return this.$store.state.order.orderLines[this.index];
    }
  }
};
</script>
