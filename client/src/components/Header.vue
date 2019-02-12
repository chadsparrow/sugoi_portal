<template>
  <div class="mt-3">
    <!-- Default switch -->
    <div class="custom-control custom-switch d-print-none">
      <input type="checkbox" class="custom-control-input" id="customSwitches" v-model="quoteToggle">
      <label class="custom-control-label" for="customSwitches">Quote</label>
    </div>
    <div class="align-items-center" style="height: 70px;">
      <img src="../../public/images/sugoi_sombrio-customlogo_black.png" class="float-right">
      <h1 class="card-title mb-4">{{headerTitle}}</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      quoteToggle: false
    };
  },
  computed: {
    order() {
      return this.$store.state.order;
    },
    headerTitle() {
      return this.quoteToggle ? "Initial Quote" : "Order Confirmation";
    }
  }
};
</script>
