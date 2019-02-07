<template>
  <div class="card mt-2 bg-light">
    <div class="card-header">
      <h6>{{title}}</h6>
    </div>
    <div class="card-body">
      <small v-if="orderLines == undefined">Undefined!</small>
      <div v-else-if="orderLines.length ==0">
        <small>There are no lines as of yet!</small>
        <hr>
      </div>
      <div v-else class="card p-1">
        <OrderLine v-for="(line, index) in orderLines" :key="line._id" :index="index"></OrderLine>
      </div>
      <button @click.prevent type="button" class="btn btn-dark btn-block mt-3 d-print-none">Add Line</button>
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
