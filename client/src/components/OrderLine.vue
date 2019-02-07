<template>
  <div>
    <div class="row">
      <div class="col-sm-12 mb-0">
        <span class="card-title badge badge-secondary">{{orderLine.lineNumber}}</span>
      </div>
      <div
        v-if="orderLine.lineJobType && orderLine.swoReference && orderLine.priceBreak"
        class="col-sm-3 border-right"
      >
        <div v-if="orderLine.lineJobType" class="mb-2 col-sm-12">Job Type: {{orderLine.lineJobType}}</div>
        <div
          v-if="orderLine.swoReference"
          class="mb-2 col-sm-12"
        >SO.Ref#: {{orderLine.swoReference}}</div>
        <div
          v-if="orderLine.priceBreak"
          class="mb-2 col-sm-12"
        >Price Break: {{orderLine.priceBreak}} units</div>
      </div>
      <div
        v-if="orderLine.graphicCode && orderLine.colour1 && orderLine.colour2 && orderLine.colour3 && orderLine.colourWayCode"
        class="col-sm-6"
      >
        <div v-if="orderLine.graphicCode" class="mb-2 col-sm-12">Graphic: {{orderLine.graphicCode}}</div>
        <div v-if="orderLine.colour1" class="mb-2 col-sm-4">Colour 1: {{orderLine.colour1}}</div>
        <div v-if="orderLine.colour2" class="mb-2 col-sm-4">Colour 2: {{orderLine.colour2}}</div>
        <div v-if="orderLine.colour3" class="mb-2 col-sm-4">Colour 3: {{orderLine.colour3}}</div>
        <div
          v-if="orderLine.colourWayCode"
          class="mb-2 col-sm-12"
        >ColourWay: {{orderLine.colourWayCode}}</div>
      </div>
      <div
        v-if="orderLine.tracingCharge && orderLine.creativeCharge && orderLine.scaledArtCharge"
        class="col-sm-3 border-left"
      >
        <div
          v-if="orderLine.tracingCharge"
          class="mb-2 col-sm-4"
        >Tracing: ${{orderLine.tracingCharge}}</div>
        <div
          v-if="orderLine.creativeCharge"
          class="mb-2 col-sm-4"
        >Creative: ${{orderLine.creativeCharge}}</div>
        <div
          v-if="orderLine.scaledArtCharge"
          class="mb-2 col-sm-4"
        >Scaled Art: ${{orderLine.scaledArtCharge}}</div>
      </div>
    </div>
    <hr>
    <div class="items mt-0">
      <LineItem
        v-for="(lineitem, childIndex) in  lineItems"
        :key="lineitem._id"
        :index="childIndex"
        :lineIndex="index"
      ></LineItem>
    </div>
    <div class="buttons">
      <button type="button" class="btn btn-secondary mr-1 d-print-none" @click.prevent>Add Item</button>
      <button type="button" class="btn btn-danger d-print-none" @click.prevent>Cancel Full Line</button>
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
.card {
  font-size: 14px;
}
</style>

