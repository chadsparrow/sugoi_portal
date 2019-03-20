<template>
  <div id="home">
    <order-details/>
    <order-lines-holder/>
    <totals-box/>
  </div>
</template>

<script>
import OrderDetails from "../components/OrderDetails.vue";
import OrderLinesHolder from "../components/OrderLinesHolder.vue";
import TotalsBox from "../components/TotalsBox.vue";

export default {
  name: "Home",
  components: {
    OrderDetails,
    OrderLinesHolder,
    TotalsBox
  }
};
</script>
