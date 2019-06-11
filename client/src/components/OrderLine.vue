<template>
  <div v-if="cancelled === false">
    <loading :active.sync="isLoading" :is-full-page="fullPage"></loading>
    <hr>
    <div class="card border-secondary mb-3 line-card" :id="orderLine.lineNumber">
      <div class="card-header bg-secondary text-light p-1 justify-items-center">
        <span>Line: {{orderLine.lineNumber}}</span>
        <div
          class="badge badge-warning text-center ml-3"
          v-if="orderLine.graphicCode != 'CUSTM' && orderLine.graphicCode != null && (orderLine.priceBreak == 2 || orderLine.priceBreak == 6 || orderLine.priceBreak == 12 || orderLine.priceBreak == 24)"
        >Quick Design - 10% OFF</div>
      </div>
      <div class="card-body m-0 p-1">
        <div class="row m-0 mb-3">
          <div class="col">
            Job Type:
            <span>{{orderLine.lineJobType}}</span>
          </div>
          <div class="col" v-if="orderLine.swoReference">
            SO.Ref#:
            <span>{{orderLine.swoReference}}</span>
          </div>
          <div class="col">
            Price Break:
            <span>{{orderLine.priceBreak}} units</span>
          </div>
          <div class="col">
            Graphic:
            <span>{{orderLine.graphicCode}}</span>
          </div>
          <div class="col" v-if="orderLine.colourWayCode">
            ColourWay:
            <span>{{orderLine.colourWayCode}}</span>
          </div>
          <div
            v-if="orderLine.tracingCharge && orderLine.creativeCharge && orderLine.scaledArtCharge && orderLine.colourWashCharge"
            class="my-2 col-sm-12 bg-dark text-white text-center rounded"
          >Line Add-Ons</div>
          <div v-if="orderLine.tracingCharge" class="col-sm-3 text-center">
            <span
              class="badge badge-dark text-light"
            >Tracing: ${{formatPrice(orderLine.tracingCharge)}}</span>
          </div>
          <div v-if="orderLine.creativeCharge" class="col-sm-3 text-center">
            <span
              class="badge badge-dark text-light"
            >Creative: ${{formatPrice(orderLine.creativeCharge)}}</span>
          </div>
          <div v-if="orderLine.scaledArtCharge" class="col-sm-3 text-center">
            <span
              class="badge badge-dark text-light"
            >Scaled Art: ${{formatPrice(orderLine.scaledArtCharge)}}</span>
          </div>
          <div v-if="orderLine.colourWashCharge" class="col-sm-3 text-center">
            <span
              class="badge badge-dark text-light"
            >Colour Wash: ${{formatPrice(orderLine.colourWashCharge)}}</span>
          </div>
        </div>
        <div class="text-center mt-2" v-if="disabledEdit === false">
          <router-link
            tag="button"
            class="btn btn-sm btn-success d-print-none"
            :to="`/editline/${this.index}`"
          >Edit Line Details</router-link>
        </div>
        <div class="items mt-2 row" v-if="orderLine.items.length">
          <div class="col-sm-1"></div>
          <div class="col-sm-11">
            <LineItem
              v-for="(lineitem, childIndex) in orderLine.items"
              :key="childIndex"
              :index="childIndex"
              :lineIndex="index"
            ></LineItem>
          </div>
        </div>
      </div>
      <div class="card-footer p-1">
        <button
          type="button"
          class="btn btn-sm btn-info mr-1 d-print-none"
          @click.prevent="addItem"
          v-if="disabledEdit === false"
        >Add Item</button>
        <button
          type="button"
          class="btn btn-sm btn-danger mr-1 d-print-none"
          @click.prevent="cancelLine"
          v-if="disabledEdit === false"
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
  </div>
</template>

<script>
import LineItem from "./LineItem.vue";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "OrderLine",
  props: ["index"],
  data() {
    return {
      fullPage: true,
      title: "Lines"
    };
  },
  components: {
    LineItem,
    Loading
  },
  computed: {
    order() {
      return this.$store.state.order;
    },
    orderLine() {
      return this.$store.state.order.orderLines[this.index];
    },
    totalBeforeAddOns() {
      return this.$store.getters.totalBeforeAddOns(this.index);
    },
    cancelled() {
      return this.$store.getters.lineCancelled(this.index);
    },
    isLoading() {
      return this.$store.getters.isLoading;
    },
    disabledEdit() {
      return this.$store.getters.disableEdit;
    }
  },
  methods: {
    formatPrice(value) {
      let val = (value / 1).toFixed(2);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    cancelLine() {
      let checkdelete = confirm("Are you sure?");
      if (checkdelete) {
        this.$store.dispatch("cancelLine", this.index);
      }
    },
    addItem() {
      this.$store
        .dispatch("addItem", this.index)
        .then(itemLength => {
          this.$router.push({ path: `/edititem/${this.index}/${itemLength}` });
        })
        .catch(err => {
          //
        });
    }
  }
};
</script>

<style scoped>
span {
  font-weight: bold;
  font-size: 14px;
}

hr {
  border: 0;
  clear: both;
  display: block;
  height: 2px;
  color: #333;
  background-color: #333;
}
</style>
