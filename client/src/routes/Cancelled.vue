<template>
	<div class="container">
		<!-- <ul class="list-group list-group-flush">
      <li class="list-group-item row" v-for="(item, index) in cancelledItems" :key="index">
        <div class="col">{{item.itemNumber}}</div>
        <div class="col">{{item.styleCode}}</div>
        <div class="col">{{item.styleCode}}</div>
        <div class="col">{{item.totalUnits}}</div>
        <div class="col">{{item.itemTotalPrice}}</div>
        <button>RISE!</button>
      </li>
    </ul>-->
	</div>
</template>

<script>
export default {
	name: 'Cancelled'
	// data (){
	//   return  {
	//     orderLines(){
	//       return this.$store.order.orderLines;
	//     }
	//   }
	// },
	// computed: {
	//   cancelledItems() {
	//     let cancelled = [];
	//     for (let orderLine of this.orderLines) {
	//       const items = orderLine.items;
	//       for (let item of items) {
	//         if (item.cancelled === true) {
	//         }
	//       }
	//     }
	//     return cancelled;
	//   }
	// }
};
</script>
