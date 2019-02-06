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
        <OrderLines v-for="(line, index) in orderLines" :key="index"></OrderLines>
      </div>
      <button @click.prevent type="button" class="btn btn-dark btn-block mt-3 d-print-none">Add Line</button>
    </div>
  </div>
</template>

<script>
import OrderLines from "./OrderLines.vue";
import { mapMultiRowFields } from "vuex-map-fields";

export default {
  name: "OrderLinesHolder",
  components: {
    OrderLines
  },
  computed: {
    ...mapMultiRowFields(["orderLines"])
  },
  data() {
    return {
      title: "Lines"
    };
  }
};
</script>
