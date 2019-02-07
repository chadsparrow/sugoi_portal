<template>
  <div class="card mb-2 border-secondary">
    <div class="card-header bg-secondary text-light p-1">
      <h6 class="ml-2 mb-0">Line: {{orderLine.lineNumber}}</h6>
    </div>
    <div class="card-body p-1">
      <div class="row">
        <div class="col-sm-3 border-right">
          <div class="mb-2 col-sm-12">Job Type: {{orderLine.lineJobType}}</div>
          <div class="mb-2 col-sm-12">SO.Ref#: {{orderLine.swoReference}}</div>
          <div class="mb-2 col-sm-12">Price Break: {{orderLine.priceBreak}} units</div>
        </div>
        <div class="col-sm-6">
          <div class="mb-2 col-sm-12">Graphic: {{orderLine.graphicCode}}</div>
          <div v-if="orderLine.colour1" class="mb-2 col-sm-4">Colour 1: {{orderLine.colour1}}</div>
          <div v-if="orderLine.colour2" class="mb-2 col-sm-4">Colour 2: {{orderLine.colour2}}</div>
          <div v-if="orderLine.colour3" class="mb-2 col-sm-4">Colour 3: {{orderLine.colour3}}</div>
          <div
            v-if="orderLine.colourWayCode"
            class="mb-2 col-sm-12"
          >ColourWay: {{orderLine.colourWayCode}}</div>
        </div>
        <div class="col-sm-3 border-left">
          <div class="mb-2 col-sm-12">Tracing: ${{orderLine.tracingCharge}}</div>
          <div class="mb-2 col-sm-12">Creative: ${{orderLine.creativeCharge}}</div>
          <div class="mb-2 col-sm-12">Scaled Art: ${{orderLine.scaledArtCharge}}</div>
        </div>
      </div>
      <div class="items">
        <LineItem
          v-for="(lineitem, childIndex) in lineItems"
          :key="lineitem._id"
          :index="childIndex"
          :lineIndex="index"
          :lineNumber="orderLine.lineNumber"
        ></LineItem>
      </div>
      <div class="buttons mt-2 d-print-none">
        <button type="button" class="btn btn-sm btn-success mr-1" @click.prevent>Edit Line Details</button>
        <button type="button" class="btn btn-sm btn-secondary mr-1" @click.prevent>Add Item</button>
        <button type="button" class="btn btn-sm btn-danger" @click.prevent>Cancel Full Line</button>
      </div>
    </div>
  </div>
</template>

<script>
import LineItem from "./LineItem.vue";

export default {
  name: "OrderLine",
  props: ["index"],
  components: {
    LineItem
  },
  computed: {
    orderLine() {
      return this.$store.state.order.orderLines[this.index];
    },
    lineItems() {
      return this.$store.state.order.orderLines[this.index].items;
    }
  },
  data() {
    return {
      title: "Lines"
    };
  }
};
</script>

<style scoped>
.row {
  font-size: 14px;
}
</style>

