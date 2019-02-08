<template>
  <div id="home">
    <order-details></order-details>
    <order-lines-holder></order-lines-holder>
  </div>
</template>

<script>
import OrderDetails from "../components/OrderDetails.vue";
import OrderLinesHolder from "../components/OrderLinesHolder.vue";

export default {
  name: "Home",
  components: {
    OrderDetails,
    OrderLinesHolder
  }
};
</script>
