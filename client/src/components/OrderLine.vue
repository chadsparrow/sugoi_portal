<template>
  <div class="card border-secondary mb-3" v-if="!orderLine.cancelled">
    <div class="card-header bg-secondary text-light p-1 justify-items-center">
      <span>Line: {{orderLine.lineNumber}}</span>
      <div
        class="badge badge-warning text-center ml-3"
        v-if="orderLine.graphicCode != 'CUSTM' && orderLine.graphicCode != null"
      >Quick Design - 10% OFF</div>
      <span class="float-right">Details</span>
    </div>
    <div class="card-body m-0 p-1">
      <div class="row">
        <!-- LEFT SECTION -->
        <div class="col-sm-9 border-right">
          <div class="row p-2">
            <div class="col">Job Type: {{orderLine.lineJobType}}</div>
            <div class="col" v-if="orderLine.swoReference">SO.Ref#: {{orderLine.swoReference}}</div>
            <div class="col">Price Break: {{orderLine.priceBreak}} units</div>
            <div class="col">Graphic: {{orderLine.graphicCode}}</div>
            <div class="col" v-if="orderLine.colourWayCode">ColourWay: {{orderLine.colourWayCode}}</div>
          </div>
        </div>
        <!-- RIGHT SECTION -->
        <div class="col-sm-3 border-left m-0">
          <div class="mb-2 col-sm-12 bg-dark text-white text-center rounded">Line Add-Ons</div>
          <div v-if="orderLine.tracingCharge" class="mb-2 col-sm-12">
            Tracing:
            <span
              class="float-right badge badge-dark text-light"
            >${{formatPrice(orderLine.tracingCharge)}}</span>
          </div>
          <div v-if="orderLine.creativeCharge" class="mb-2 col-sm-12">
            Creative:
            <span
              class="float-right badge badge-dark text-light"
            >${{formatPrice(orderLine.creativeCharge)}}</span>
          </div>
          <div v-if="orderLine.scaledArtCharge" class="col-sm-12">
            Scaled Art:
            <span
              class="float-right badge badge-dark text-light"
            >${{formatPrice(orderLine.scaledArtCharge)}}</span>
          </div>
          <div v-if="orderLine.colourWashCharge" class="col-sm-12">
            Colour Wash Charge:
            <span
              class="float-right badge badge-dark text-light"
            >${{formatPrice(orderLine.colourWashCharge)}}</span>
          </div>
        </div>
      </div>
      <div class="text-center mt-2">
        <button
          type="button"
          class="btn btn-sm btn-success d-print-none"
          @click.prevent="goToEdit"
        >Edit Line Details</button>
      </div>
      <div class="items mt-2" v-if="orderLine.items.length">
        <LineItem
          v-for="(lineitem, childIndex) in orderLine.items"
          :key="childIndex"
          :index="childIndex"
          :lineIndex="index"
        ></LineItem>
      </div>
    </div>
    <div class="card-footer p-1">
      <button
        type="button"
        class="btn btn-sm btn-info mr-1 d-print-none"
        @click.prevent="addItem"
      >Add Item</button>
      <button
        type="button"
        class="btn btn-sm btn-danger mr-1 d-print-none"
        @click.prevent="cancelLine"
      >Cancel Full Line</button>
      <div class="float-right">
        <div
          class="text-center p-1"
          v-if="orderLine.totalAddOns > 0"
        >Sub Total: ${{formatPrice(totalBeforeAddOns)}}</div>
        <div
          class="rounded bg-dark text-center text-white p-1"
          v-if="orderLine.totalAddOns > 0"
        >Total Add-Ons: ${{formatPrice(orderLine.totalAddOns)}}</div>
        <div
          class="rounded bg-secondary text-center text-light p-2"
          style="font-size: 16px; font-weight: bold;"
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
    },
    totalBeforeAddOns() {
      return this.$store.getters.totalBeforeAddOns(this.index);
    }
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
    },
    cancelLine() {
      let checkdelete = confirm("Are you sure?");
      if (checkdelete) {
        this.$store.dispatch("cancelLine", this.index);
      }
    },
    addItem() {
      this.$store.dispatch("addItem", this.index);
    }
  }
};
</script>

