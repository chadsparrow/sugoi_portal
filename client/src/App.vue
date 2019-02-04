<template>
  <div id="app" class="container">
    <Header/>
    <OrderDetails/>
    <OrderLines/>
  </div>
</template>

<script>
import OrderDetails from "./components/OrderDetails.vue";
import OrderLines from "./components/OrderLines.vue";
import Header from "./Header.vue";

export default {
  name: "App",
  created() {
    this.$store.dispatch("getOrderData", "1234567");
  },
  components: {
    OrderDetails,
    OrderLines,
    Header
  }
};
</script>

<style>
img {
  height: 65px;
}
</style>
