<template>
  <div class="item card border-dark mb-2" v-if="!item.cancelled">
    <div class="card-header bg-secondary mb-0 p-1">
      <div class="row text-light align-items-center">
        <div class="col-sm-2">Item: {{item.itemNumber}}</div>
        <div class="col sm-3">Description: {{item.extendedDescription}}</div>
        <div class="col-sm-3">StyleCode: {{item.styleCode}}</div>
        <div class="col-sm-2">JBA: {{item.jbaCode}}</div>
      </div>
    </div>
    <div class="card-body p-1">
      <div class="row align-items-center text-center">
        <div class="col-sm-2">Ink: {{item.inkType}}</div>
        <div v-if="item.childReference" class="col-sm-2">Child Ref#: {{item.childReference}}</div>
        <div class="col-sm-2">Thread: {{item.thread}}</div>
        <div v-if="item.zipper" class="col-sm-2">Zipper: {{item.zipper}}</div>
        <div v-if="item.contrast" class="col-sm-2">Contrast: {{item.contrast}}</div>
        <div v-if="item.personalization" class="col-sm-2">PRS: {{item.personalization}}</div>
        <div v-if="item.zap" class="col-sm-2">ZAP: YES</div>
      </div>
      <hr class="my-2">
      <div class="row align-items-center text-center">
        <div class="col-sm-1 offset-sm-10" v-if="item.one">
          ONE:
          <span style="font-size: 15px; font-weight: bold;">{{item.one}}</span>
        </div>
        <div class="col-sm-12" v-else>
          <div class="row">
            <div class="col-sm-1 offset-sm-2">
              2XS:
              <span style="font-size: 15px; font-weight: bold;">{{item.xxs}}</span>
            </div>
            <div class="col-sm-1">
              XS:
              <span style="font-size: 15px; font-weight: bold;">{{item.xs}}</span>
            </div>
            <div class="col-sm-1">
              S:
              <span style="font-size: 15px; font-weight: bold;">{{item.s}}</span>
            </div>
            <div class="col-sm-1">
              M:
              <span style="font-size: 15px; font-weight: bold;">{{item.m}}</span>
            </div>
            <div class="col-sm-1">
              L:
              <span style="font-size: 15px; font-weight: bold;">{{item.l}}</span>
            </div>
            <div class="col-sm-1">
              XL:
              <span style="font-size: 15px; font-weight: bold;">{{item.xl}}</span>
            </div>
            <div class="col-sm-1">
              2XL:
              <span style="font-size: 15px; font-weight: bold;">{{item.xxl}}</span>
            </div>
            <div class="col-sm-1">
              3XL:
              <span style="font-size: 15px; font-weight: bold;">{{item.xxxl}}</span>
            </div>
          </div>
        </div>
      </div>
      <hr class="my-2">
      <div class="row m-0 p-0">
        <div class="col text-center">Total Units
          <br>
          <span style="font-weight: bold; font-size: 14px;">{{item.totalUnits}}</span>
        </div>

        <div class="col text-center">
          Unit Price ({{priceBreak}})
          <br>
          <span style="font-weight: bold; font-size: 14px;">$ {{formatPrice(item.unitPrice)}}</span>
        </div>

        <div class="col text-center">Add-Ons
          <br>
          <span style="font-weight: bold; font-size: 14px;">$ {{formatPrice(item.addOns)}}</span>
        </div>

        <div class="col text-center">Discount
          <br>
          <span style="font-weight: bold; font-size: 14px;">{{item.itemDiscount}}%</span>
        </div>

        <div class="col text-center">Final Unit Price
          <br>
          <span style="font-weight: bold; font-size: 14px;">$ {{formatPrice(item.finalUnitPrice)}}</span>
        </div>

        <div
          class="col text-center border border-dark rounded p-1"
          style="font-weight: bold; font-size: 14px;"
        >Item Total:
          <br>
          $ {{formatPrice(item.itemTotalPrice)}}
        </div>
      </div>
    </div>
    <div class="card-footer text-center d-print-none p-1">
      <button class="btn btn-sm btn-success mr-1" @click.prevent="goToEdit">Edit Item</button>
      <button class="btn btn-sm btn-danger">Cancel Item</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "LineItem",
  props: ["lineIndex", "index", "lineNumber"],
  computed: {
    item() {
      return this.$store.state.order.orderLines[this.lineIndex].items[
        this.index
      ];
    },
    order() {
      return this.$store.state.order;
    },
    orderLine() {
      return this.$store.state.order.orderLines[this.lineIndex];
    },

    priceBreak() {
      return this.$store.getters.getPriceBreak(this.lineIndex);
    }
  },
  methods: {
    formatPrice(value) {
      let val = (value / 1).toFixed(2);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    goToEdit() {
      this.$router.push({ path: `edititem/${this.lineIndex}/${this.index}` });
    }
  }
};
</script>

<style>
.card {
  font-size: 12px;
}
</style>
