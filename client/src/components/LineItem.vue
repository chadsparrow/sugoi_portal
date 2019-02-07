<template>
  <div class="item card border-dark mb-2">
    <div class="card-header bg-secondary mb-0">
      <div class="row bg-secondary text-light align-items-center">
        <div class="col-sm-2">Item: {{item.itemNumber}}</div>
        <div class="col sm-3">Description: {{item.selectedConfig}}</div>
        <div class="col-sm-2">Style: {{item.selectedStyle}}</div>
        <div class="col-sm-3">StyleCode: {{item.styleCode}}</div>
        <div class="col-sm-2">JBA: {{item.jbaCode}}</div>
      </div>
    </div>
    <div class="card-body p-2">
      <div class="row align-items-center text-center">
        <div class="col-sm-2">Ink: {{item.inkType}}</div>
        <div v-if="item.childReference" class="col-sm-2">Child Ref#: {{item.childReference}}</div>
        <div class="col-sm-2">Thread: {{item.thread}}</div>
        <div v-if="item.zipper" class="col-sm-2">Zipper: {{item.zipper}}</div>
        <div v-if="item.contrast" class="col-sm-2">Contrast: {{item.contrast}}</div>
        <div v-if="item.personalization" class="col-sm-2">PRS: {{item.personalization}}</div>
        <div v-if="item.zap" class="col-sm-2">ZAP: {{item.zap}}</div>
      </div>
      <hr class="my-2">
      <div class="row align-items-center text-center">
        <div class="col-sm-1 offset-sm-2">
          2XS:
          <span class="badge badge-dark">{{item.xxs}}</span>
        </div>
        <div class="col-sm-1">
          XS:
          <span class="badge badge-dark">{{item.xs}}</span>
        </div>
        <div class="col-sm-1">
          S:
          <span class="badge badge-dark">{{item.s}}</span>
        </div>
        <div class="col-sm-1">
          M:
          <span class="badge badge-dark">{{item.m}}</span>
        </div>
        <div class="col-sm-1">
          L:
          <span class="badge badge-dark">{{item.l}}</span>
        </div>
        <div class="col-sm-1">
          XL:
          <span class="badge badge-dark">{{item.xl}}</span>
        </div>
        <div class="col-sm-1">
          2XL:
          <span class="badge badge-dark">{{item.xxl}}</span>
        </div>
        <div class="col-sm-1">
          3XL:
          <span class="badge badge-dark">{{item.xxxl}}</span>
        </div>
      </div>
      <hr class="my-2">
      <div class="row rounded-bottom align-items-center text-center">
        <div class="col-sm-2 text-center">Total Units
          <br>units
        </div>
        <div class="col-sm-2 text-center">Unit Price
          <br>$
        </div>
        <div class="col-sm-2 text-center">Add-Ons
          <br>$
        </div>
        <div class="col-sm-2 text-center">Discount
          <br>$
        </div>
        <div class="col-sm-2 text-center">Final Unit Price
          <br>$
        </div>
        <div class="col-sm-2 text-center">Total Price
          <br>$
        </div>
      </div>
    </div>
    <div class="card-footer text-right d-print-none">
      <button class="btn btn-sm btn-success mr-1">Edit Item</button>
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
    }
  }
};
</script>
<style scoped>
.card {
  font-size: 14px;
}
</style>
