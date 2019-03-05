<template>
  <div class="mt-2 mb-4">
    <small v-if="orderLines == undefined">Undefined!</small>
    <div v-else-if="orderLines.length == 0">
      <small>There are no lines as of yet!</small>
    </div>
    <div v-else>
      <OrderLine v-for="(line, index) in orderLines" :key="index" :index="index"></OrderLine>
    </div>
    <div class="p-1">
      <button
        type="button"
        class="btn btn-dark btn-block d-print-none"
        @click.prevent="addLine"
      >Add Line</button>
    </div>
  </div>
</template>

<script>
import OrderLine from "./OrderLine.vue";

export default {
  name: "OrderLinesHolder",
  components: {
    OrderLine
  },
  computed: {
    orderLines() {
      return this.$store.state.order.orderLines;
    }
  },
  methods: {
    addLine() {
      this.$store.dispatch("addLine");
    }
  }
};
</script>

<style>
.card {
  font-size: 12px;
}
</style>
