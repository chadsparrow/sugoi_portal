<template>
  <div>
    <div class="custom-control custom-switch d-print-none">
      <input type="checkbox" class="custom-control-input" id="customSwitches" v-model="quoteToggle">
      <label class="custom-control-label" for="customSwitches">Quote</label>
    </div>
    <img class="float-right" src="../../public/images/sugoi_sombrio-customlogo_black.png">
    <h1 class="card-title display-4">{{headerTitle}}</h1>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      quoteToggle: true
    };
  },
  computed: {
    headerTitle() {
      return this.quoteToggle ? "Initial Quote" : "Order Confirmation";
    }
  }
};
</script>
