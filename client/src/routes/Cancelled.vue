<template>
  <div class="container">
    <ul class="list-group list-group-flush">
      <li class="list-group-item row" v-for="(item, index) in cancelledItems" :key="index">
        <div class="col">{{item.itemNumber}}</div>
        <div class="col">{{item.styleCode}}</div>
        <div class="col">{{item.styleCode}}</div>
        <div class="col">{{item.totalUnits}}</div>
        <div class="col">{{item.itemTotalPrice}}</div>
        <button>RISE!</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Cancelled",
  computed: {
    cancelledItems() {
      let cancelled = [];
      const orderLines = this.$store.state.order.orderLines;
      for (let line of orderLines) {
        const items = line.items;
        for (let item of items) {
          if (item.cancelled === true) {
            cancelled.push(item);
          }
        }
      }
      console.log(cancelled.length);
      return cancelled;
    }
  }
};
</script>

