<template>
  <div class="mt-2 mb-4">
    <loading :active.sync="isLoading" :is-full-page="fullPage"></loading>
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
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "OrderLinesHolder",
  components: {
    OrderLine,
    Loading
  },
  data() {
    return {
      isLoading: false,
      fullPage: true
    };
  },
  computed: {
    orderLines() {
      return this.$store.state.order.orderLines;
    }
  },
  methods: {
    addLine() {
      this.isLoading = true;
      this.$store.dispatch("addLine");
      this.isLoading = false;
    }
  }
};
</script>

<style>
.card {
  font-size: 12px;
}
</style>
