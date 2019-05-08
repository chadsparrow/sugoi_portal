<template>
  <div class="anchorBox" v-if="orderLines && orderLines.length > 0">
    <div class="my-2">
      <a href="#app">Top</a>
    </div>
    <div v-for="(orderLine, index) in orderLines" :key="index" class="my-2">
      <a :href="`#${orderLine.lineNumber}`" v-if="!orderLine.cancelled">{{orderLine.lineNumber}}</a>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    orderLines() {
      return this.$store.state.order.orderLines;
    }
  }
};
</script>

<style>
.anchorBox {
  position: fixed;
  top: 50px;
  left: 6px;
  background-color: lightgray;
  color: black;
  font-weight: bold;
  text-align: center;
  width: 45px;
  padding: 8px;
  z-index: 10;
  font-size: 12px;
}

.anchorBox div > a {
  text-decoration: none;
  color: black;
}

.anchorBox div > a:hover {
  text-decoration: underline;
  color: black;
}

.anchorBox div > a:active {
  text-decoration: underline;
}
</style>
