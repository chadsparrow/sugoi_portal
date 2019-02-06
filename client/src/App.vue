<template>
  <div id="app" class="container">
    <Header/>
    <OrderDetails></OrderDetails>
    <OrderLinesHolder></OrderLinesHolder>
  </div>
</template>

<script>
import OrderDetails from "./components/OrderDetails.vue";
import OrderLinesHolder from "./components/OrderLinesHolder.vue";
import Header from "./Header.vue";

export default {
  name: "App",
  created() {
    this.$store.dispatch("getOrderData", "1234567");
    this.$store.dispatch("getOrderLines", "1234567");
    this.$store.dispatch("getReps");
    this.$store.dispatch("getProvincialTaxes");
    this.$store.dispatch("getUSAStates");
  },
  components: {
    OrderDetails,
    OrderLinesHolder,
    Header
  }
};
</script>

<style>
img {
  height: 65px;
}
</style>
