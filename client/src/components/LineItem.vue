<template>
  <div class="item mb-3">
    <div class="card col-sm-12">
      <small>{{item.itemNumber}}</small>
      <div class="row p-1 small bg-secondary text-light rounded-top align-items-center">
        <div class="col sm-4">Description: {{item.selectedConfig}}</div>
        <div class="col-sm-2">Style: {{item.selectedStyle}}CA02</div>
        <div class="col-sm-4">StyleCode: {{item.styleCode}}</div>
        <div class="col-sm-2">JBA: {{item.jbaCode}}</div>
      </div>
      <div class="row mt-2 align-items-center">
        <div class="col-sm-1">
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              name="inlineRadio1"
              id="ink"
              value="D"
              checked
            >
            <label class="form-check-label small" for="inlineRadio1">Standard</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadio2" id="ink" value="F">
            <label class="form-check-label small" for="inlineRadio2">Fluorescent</label>
          </div>
        </div>
        <div class="col-sm-2 offset-sm-1">
          <div class="input-group input-group-sm mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">C.Ref #</span>
            </div>
            <input class="form-control form-control-sm" id="swoRef" type="text">
          </div>
        </div>
        <div class="col-sm-2">
          <div class="input-group input-group-sm mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">Zipper</span>
            </div>
            <input class="form-control form-control-sm" id="swoRef" type="text">
          </div>
        </div>
        <div class="col-sm-2">
          <div class="input-group input-group-sm mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">Thread</span>
            </div>
            <input class="form-control form-control-sm" id="swoRef" type="text">
          </div>
        </div>
        <div class="col-sm-2">
          <div class="input-group input-group-sm mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">Contrast</span>
            </div>
            <input class="form-control form-control-sm" id="swoRef" type="text">
          </div>
        </div>
        <div class="col-sm-1">
          <div class="input-group form-check">
            <input type="checkbox" class="form-check-input" id="exampleCheck1">
            <label class="form-check-label" for="exampleCheck1">PRS</label>
          </div>
        </div>
        <div class="col-sm-1">
          <div class="input-group form-check">
            <input type="checkbox" class="form-check-input" id="exampleCheck1">
            <label class="form-check-label" for="exampleCheck1">ZAP</label>
          </div>
        </div>
      </div>
      <div class="row mt-1">
        <div class="col-sm-12">
          <div class="input-group input-group-sm mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">Sizes</span>
            </div>
            <input class="form-control form-control-sm" id="swoRef" type="number" placeholder="2XS">
            <input class="form-control form-control-sm" id="swoRef" type="number" placeholder="XS">
            <input class="form-control form-control-sm" id="swoRef" type="number" placeholder="S">
            <input class="form-control form-control-sm" id="swoRef" type="number" placeholder="M">
            <input class="form-control form-control-sm" id="swoRef" type="number" placeholder="L">
            <input class="form-control form-control-sm" id="swoRef" type="number" placeholder="XL">
            <input class="form-control form-control-sm" id="swoRef" type="number" placeholder="2XL">
            <input class="form-control form-control-sm" id="swoRef" type="number" placeholder="3XL">
          </div>
        </div>
      </div>
      <div class="row rounded-bottom pb-2 align-items-center text-center">
        <div class="col-sm-2">
          <span class="badge">Total Units</span>
          <input class="form-control form-control-sm text-center" type="number">
        </div>
        <div class="col-sm-2">
          <span class="badge">Unit Price</span>
          <input class="form-control form-control-sm text-center" type="number">
        </div>
        <div class="col-sm-2">
          <span class="badge">Add-Ons</span>
          <input class="form-control form-control-sm text-center" type="number">
        </div>
        <div class="col-sm-2">
          <span class="badge">Discount</span>
          <input class="form-control form-control-sm text-center" type="number">
        </div>
        <div class="col-sm-2">
          <span class="badge">Final Unit Price</span>
          <input class="form-control form-control-sm text-center" type="number">
        </div>
        <div class="col-sm-2">
          <span class="badge">Total Price</span>
          <input class="form-control form-control-sm text-center" type="number">
        </div>
      </div>
      <div class="mt-2 mb-2">
        <button class="btn btn-success d-print-none mr-2" @click.prevent>Update Item</button>
        <button class="btn btn-danger d-print-none" @click.prevent>Cancel Item</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LineItem",
  props: ["lineIndex", "index"],
  computed: {
    item() {
      return this.$store.state.order.orderLines[this.lineIndex].items[
        this.index
      ];
    },
    styles() {
      return this.$store.state.styles;
    }
  }
};
</script>
<style scoped>
.card {
  font-size: 16px !important;
}
</style>
