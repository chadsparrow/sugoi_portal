<template>
  <div>
    <div v-for="(orderline, index) in orderLines" :key="index" class="col-sm-12">
      <div class="row">
        <div class="col-sm-12">
          <span class="card-title badge badge-secondary">{{orderline.lineNumber}}</span>
        </div>
        <div class="col-sm-3 border-right">
          <div class="input-group input-group-sm mb-1">
            <div class="input-group-prepend">
              <span class="input-group-text">Job Type</span>
            </div>
            <select class="form-control form-control-sm" id="jobType" v-model="orderline.jobType">
              <option value="NEW" selected>NEW</option>
              <option value="NWR">NWR</option>
              <option value="REC">REC</option>
              <option value="MSR">MSR</option>
            </select>
          </div>
          <div class="input-group input-group-sm mb-1">
            <div class="input-group-prepend">
              <span class="input-group-text">SO.Ref #</span>
            </div>
            <input
              class="form-control form-control-sm"
              id="swoRef"
              type="text"
              v-model.lazy="orderline.swoReference"
            >
          </div>
          <div class="input-group input-group-sm mb-0">
            <div class="input-group-prepend">
              <span class="input-group-text">Price Break</span>
            </div>
            <select
              class="form-control form-control-sm"
              id="priceBreak"
              v-model="orderline.priceBreak"
            >
              <option value="1">1</option>
              <option value="6">6</option>
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="500">500</option>
            </select>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="input-group input-group-sm mb-1">
            <div class="input-group-prepend">
              <span class="input-group-text">Graphic</span>
            </div>
            <select
              class="form-control form-control-sm"
              id="graphicCode"
              v-model="orderline.graphicCode"
            >
              <option value="CUSTOM" selected>CUSTOM</option>
              <option value="QD">QD</option>
            </select>
          </div>
          <div class="input-group input-group-sm mb-1">
            <div class="input-group-prepend">
              <span class="input-group-text">Colors</span>
            </div>
            <select class="form-control form-control-sm" id="colour1" v-model="orderline.colour1">
              <option value="col1" selected>colour 1</option>
            </select>
            <select class="form-control form-control-sm" id="colour2" v-model="orderline.colour2">
              <option value="col2" selected>colour 2</option>
            </select>
            <select class="form-control form-control-sm" id="colour3" v-model="orderline.colour3">
              <option value="col3" selected>colour 3</option>
            </select>
          </div>
          <div class="input-group input-group-sm mb-0">
            <div class="input-group-prepend">
              <span class="input-group-text">Colourway</span>
            </div>
            <select
              class="form-control form-control-sm"
              id="colourWay"
              v-model="orderline.colourWay"
            >
              <option value="CUSTOM" selected>CUSTOM</option>
              <option value="QD">QD</option>
            </select>
          </div>
        </div>
        <div class="col-sm-3 border-left">
          <div class="input-group input-group-sm mb-1">
            <div class="input-group-prepend">
              <span class="input-group-text">Tracing</span>
            </div>
            <input
              type="number"
              class="form-control text-center"
              id="tracingCharge"
              min="0"
              v-model.number="orderline.tracingCharge"
            >
          </div>
          <div class="input-group input-group-sm mb-1">
            <div class="input-group-prepend">
              <span class="input-group-text">Creative</span>
            </div>
            <input
              type="number"
              class="form-control text-center"
              id="creativeCharge"
              min="0"
              v-model.number="orderline.creativeCharge"
            >
          </div>
          <div class="input-group input-group-sm mb-0">
            <div class="input-group-prepend">
              <span class="input-group-text">Scaled</span>
            </div>
            <input
              type="number"
              class="form-control text-center"
              id="scaledArtCharge"
              min="0"
              v-model.number="orderline.scaledArtCharge"
            >
          </div>
        </div>
      </div>
      <hr>
      <div class="items">
        <div class="item" v-for="(item) in orderline.items" :key="item._id">
          <div class="card col-sm-12">
            <small>{{item.itemNumber}}</small>
            <div class="row p-1 small bg-secondary text-light rounded-top align-items-center">
              <div class="col-sm-2">
                <div class="input-group input-group-sm">
                  <select class="form-control form-control-sm">
                    <option
                      v-for="(style, index) in styles"
                      value="itemDesc"
                      :key="index"
                    >{{style.style}}</option>
                  </select>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="input-group input-group-sm">
                  <select class="form-control form-control-sm">
                    <option value="itemDesc" selected>Config</option>
                  </select>
                </div>
              </div>
              <div class="col-sm-2 small">A123121564</div>
              <div class="col-sm-2 small">UCJ52M_SS.SP.FF_DRG</div>
              <div class="col-sm-2 small">CJ52M-SSSPFF-DRG</div>
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
                  <input
                    class="form-check-input"
                    type="radio"
                    name="inlineRadio2"
                    id="ink"
                    value="F"
                  >
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
                  <input
                    class="form-control form-control-sm"
                    id="swoRef"
                    type="number"
                    placeholder="2XS"
                  >
                  <input
                    class="form-control form-control-sm"
                    id="swoRef"
                    type="number"
                    placeholder="XS"
                  >
                  <input
                    class="form-control form-control-sm"
                    id="swoRef"
                    type="number"
                    placeholder="S"
                  >
                  <input
                    class="form-control form-control-sm"
                    id="swoRef"
                    type="number"
                    placeholder="M"
                  >
                  <input
                    class="form-control form-control-sm"
                    id="swoRef"
                    type="number"
                    placeholder="L"
                  >
                  <input
                    class="form-control form-control-sm"
                    id="swoRef"
                    type="number"
                    placeholder="XL"
                  >
                  <input
                    class="form-control form-control-sm"
                    id="swoRef"
                    type="number"
                    placeholder="2XL"
                  >
                  <input
                    class="form-control form-control-sm"
                    id="swoRef"
                    type="number"
                    placeholder="3XL"
                  >
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
          </div>
          <div class="mt-2">
            <button class="btn btn-success d-print-none mr-2" @click.prevent>Update Item</button>
            <button class="btn btn-danger d-print-none" @click.prevent>Cancel Item</button>
          </div>
          <hr>
        </div>
      </div>
      <button
        type="button"
        class="btn btn-secondary mt-3 d-print-none"
        @click.prevent
      >Add Item to Line</button>
      <button type="button" class="btn btn-danger mt-2 d-print-none" @click.prevent>Cancel Full Line</button>
    </div>
  </div>
</template>

<script>
import { mapMultiRowFields } from "vuex-map-fields";

export default {
  name: "OrderLines",
  computed: {
    ...mapMultiRowFields(["orderLines"]),
    styles() {
      return this.$store.state.styles;
    }
  },
  data() {
    return {
      title: "Lines"
    };
  }
};
</script>
