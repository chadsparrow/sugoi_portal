<template>
  <div id="home">
    <order-details/>
    <order-lines-holder/>
    <totals-box/>
    <anchor-box/>
  </div>
</template>

<script>
import OrderDetails from "../components/OrderDetails.vue";
import OrderLinesHolder from "../components/OrderLinesHolder.vue";
import TotalsBox from "../components/TotalsBox.vue";
import AnchorBox from "../components/AnchorBox.vue";

export default {
  name: "Home",
  components: {
    OrderDetails,
    OrderLinesHolder,
    TotalsBox,
    AnchorBox
  }
};
</script>
