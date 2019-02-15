<template>
  <div class="card border-secondary mb-2" v-if="orderLine.cancelled == false">
    <div class="card-header bg-secondary text-light p-1">
      <span>Line: {{orderLine.lineNumber}}</span>
    </div>
    <div class="card-body p-1">
      <div class="row">
        <!-- LEFT SECTION -->
        <div class="col-sm-3 border-right">
          <div class="mb-2 col-sm-12">Job Type: {{orderLine.lineJobType}}</div>
          <div class="mb-2 col-sm-12">SO.Ref#: {{orderLine.swoReference}}</div>
          <div class="mb-2 col-sm-12">Price Break: {{orderLine.priceBreak}} units</div>
        </div>
        <!-- MIDDLE SECTION -->
        <div class="col-sm-6">
          <div class="row">
            <div class="mb-2 col-sm-6">Graphic: {{orderLine.graphicCode}}</div>
            <div
              class="mb-2 col-sm-6"
              v-if="orderLine.colourWayCode"
            >ColourWay: {{orderLine.colourWayCode}}</div>
          </div>
          <div class="row">
            <div v-if="orderLine.colour1" class="col-sm-4">Colour 1: {{orderLine.colour1}}</div>
            <div v-if="orderLine.colour2" class="col-sm-4">Colour 2: {{orderLine.colour2}}</div>
            <div v-if="orderLine.colour3" class="col-sm-4">Colour 3: {{orderLine.colour3}}</div>
          </div>
        </div>
        <!-- RIGHT SECTION -->
        <div class="col-sm-3 border-left">
          <div class="mb-2 col-sm-12">
            Tracing:
            <span class="float-right">${{formatPrice(orderLine.tracingCharge)}}</span>
          </div>
          <div class="mb-2 col-sm-12">
            Creative:
            <span class="float-right">${{formatPrice(orderLine.creativeCharge)}}</span>
          </div>
          <div class="mb-2 col-sm-12">
            Scaled Art:
            <span class="float-right">${{formatPrice(orderLine.scaledArtCharge)}}</span>
          </div>
        </div>
      </div>
      <div class="text-center d-print-none">
        <button
          type="button"
          class="btn btn-sm btn-success mr-1"
          @click.prevent="goToEdit()"
        >Edit Line Details</button>
      </div>
      <div class="items mt-2">
        <!-- <LineItem
          v-for="(lineitem, childIndex) in orderLine.items"
          :key="childIndex"
          :index="childIndex"
          :lineIndex="index"
        ></LineItem>-->
      </div>
      <div class="buttons mt-2">
        <button
          type="button"
          class="btn btn-sm btn-secondary mr-1 d-print-none"
          @click.prevent
        >Add Item</button>
        <button
          type="button"
          class="btn btn-sm btn-danger d-print-none"
          @click.prevent
        >Cancel Full Line</button>
        <div
          class="rounded bg-secondary text-light float-right p-2"
        >Line Total: $ {{formatPrice(orderLine.itemsSubTotal)}}</div>
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
    }
  },
  created() {
    this.$store.dispatch("getStyles");
  },
  data() {
    return {
      title: "Lines"
    };
  },
  methods: {
    goToEdit() {
      this.$router.push({ path: `editline/${this.index}` });
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  }
};
</script>

