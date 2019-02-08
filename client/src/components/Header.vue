<template>
  <div class="mt-3">
    <div class="align-items-center" style="height: 70px;">
      <img src="images/sugoi_sombrio-customlogo_black.png" class="float-right">
      <h1 class="card-title mb-4">Order Confirmation</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  computed: {
    order() {
      return this.$store.state.order;
    }
  }
};
</script>
