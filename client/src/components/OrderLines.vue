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
        <OrderItem></OrderItem>
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
import OrderItem from "./OrderItem.vue";

export default {
  name: "OrderLines",
  components: {
    OrderItem
  },
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
