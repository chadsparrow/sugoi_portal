<template>
  <div class="card border-dark mt-2 mb-3">
    <div class="card-header bg-dark text-light">
      <h6>{{title}}</h6>
    </div>
    <div class="card-body p-2">
      <small v-if="orderLines == undefined">Undefined!</small>
      <div v-else-if="orderLines.length ==0">
        <small>There are no lines as of yet!</small>
      </div>
      <div v-else>
        <OrderLine v-for="(line, index) in orderLines" :key="line._id" :index="index"></OrderLine>
      </div>
    </div>
    <div class="card-footer bg-dark">
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
