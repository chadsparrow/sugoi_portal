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
          <div class="input-group input-group-sm">
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
          <div class="input-group input-group-sm">
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
            <input class="form-control form-control-sm" id="swoRef" type="number">
          </div>
          <div class="input-group input-group-sm mb-1">
            <div class="input-group-prepend">
              <span class="input-group-text">Creative</span>
            </div>
            <input class="form-control form-control-sm" id="swoRef" type="number">
          </div>
          <div class="input-group input-group-sm">
            <div class="input-group-prepend">
              <span class="input-group-text">Scaled</span>
            </div>
            <input class="form-control form-control-sm" id="swoRef" type="number">
          </div>
        </div>
      </div>
      <hr>
      <div class="items">
        <div class="item">
          <h6 class="card-title badge badge-secondary float-left">01</h6>
          <button
            type="button"
            class="btn btn-danger float-right mb-2 d-print-none"
            data-toggle="tooltip"
            data-placement="left"
            title="Cancel Item"
            @click.prevent
          >&times;</button>
          <div class="card col-sm-12">
            <div class="row p-1 small bg-secondary text-light rounded-top align-items-center">
              <div class="col-sm-6">
                <div class="input-group input-group-sm">
                  <div class="input-group-prepend">
                    <span class="input-group-text">Description</span>
                  </div>
                  <select class="form-control form-control-sm">
                    <option value="itemDesc" selected>Description</option>
                  </select>
                </div>
              </div>
              <div class="col-sm-2">A123121564</div>
              <div class="col-sm-2">UCJ52M_SS.SP.FF_DRG</div>
              <div class="col-sm-2">CJ52M-SSSPFF-DRG</div>
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
            <div
              class="row bg-secondary text-light rounded-bottom p-1 align-items-center text-center"
            >
              <div class="col-sm-2 mb-2">
                <span class="badge badge-secondary mb-1">Total Units</span>
                <input class="form-control form-control-sm text-center" type="number">
              </div>
              <div class="col-sm-2 mb-2">
                <span class="badge badge-secondary mb-1">Unit Price</span>
                <input class="form-control form-control-sm text-center" type="number">
              </div>
              <div class="col-sm-2 mb-2">
                <span class="badge badge-secondary mb-1">Add-Ons</span>
                <input class="form-control form-control-sm text-center" type="number">
              </div>
              <div class="col-sm-2 mb-2">
                <span class="badge badge-secondary mb-1">Discount</span>
                <input class="form-control form-control-sm text-center" type="number">
              </div>
              <div class="col-sm-2 mb-2">
                <span class="badge badge-secondary mb-1">Final Unit Price</span>
                <input class="form-control form-control-sm text-center" type="number">
              </div>
              <div class="col-sm-2 mb-2">
                <span class="badge badge-secondary mb-1">Total Price</span>
                <input class="form-control form-control-sm text-center" type="number">
              </div>
            </div>
          </div>
          <button class="btn btn-dark mt-2 d-print-none" @click.prevent>Update Item</button>
          <hr>
        </div>

        <div class="col-sm-2 float-right bg-success text-light rounded text-center">Sub Total:
          <br>$00.00
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
    ...mapMultiRowFields(["orderLines"])
  },
  data() {
    return {
      title: "Lines"
    };
  }
};
</script>
