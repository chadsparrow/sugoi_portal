<template>
  <div class="card border-dark mt-2 mb-4">
    <div class="card-header bg-dark text-light p-2">
      <span>{{title}}</span>
    </div>
    <div class="card-body p-1">
      <small v-if="orderLines == undefined">Undefined!</small>
      <div v-else-if="orderLines.length == 0">
        <small>There are no lines as of yet!</small>
      </div>
      <div v-else>
        <OrderLine v-for="(line, index) in orderLines" :key="index" :index="index"></OrderLine>
      </div>
    </div>
    <div class="card-footer bg-dark p-1">
      <button type="button" class="btn btn-dark btn-block d-print-none">Add Line</button>
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
  data() {
    return {
      title: "Lines"
    };
  }
};
</script>

<style>
.card {
  font-size: 12px;
}
</style>
