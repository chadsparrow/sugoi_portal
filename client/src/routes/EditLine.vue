<template>
  <div class="card border-secondary" v-if="orderLine.cancelled == false">
    <div class="card-header bg-dark text-light p-2">
      <span>Line: {{orderLine.lineNumber}}</span>
    </div>
    <div class="card-body p-3">
      <div class="row">
        <div class="col-sm-3 border-right">
          <div class="form-group mb-1">
            <label for="isr" class="small my-0">Job Type:</label>
            <select
              class="form-control form-control-sm"
              id="jobType"
              v-model="orderLine.lineJobType"
            >
              <option>NEW</option>
              <option>NWR</option>
              <option>REC</option>
              <option>MSR</option>
            </select>
          </div>
          <div class="form-group mb-1">
            <label for="swoReference" class="small my-0">SO# Reference:</label>
            <input
              type="text"
              class="form-control form-control-sm"
              id="accountNum"
              v-model.trim="orderLine.swoReference"
            >
          </div>
          <div class="form-group mb-1">
            <label for="priceBreak" class="small my-0">Price Break:</label>
            <select
              class="form-control form-control-sm"
              id="jobType"
              v-model="orderLine.priceBreak"
            >
              <option>1</option>
              <option>6</option>
              <option>12</option>
              <option>24</option>
              <option>50</option>
              <option>100</option>
              <option>200</option>
              <option>500</option>
            </select>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="row">
            <!-- GRAPHIC CODE AND COLOURWAY -->
            <div class="form-group mb-1 col-sm-6">
              <label for="graphicCode" class="small my-0">Graphic Code:</label>
              <select
                class="form-control form-control-sm"
                id="graphicCode"
                v-model="orderLine.graphicCode"
                @change="loadColourWays"
              >
                <option v-for="(code, index) in graphicCodes" :key="index">{{code.graphicCode}}</option>
              </select>
            </div>
            <div
              class="form-group mb-1 col-sm-6"
              v-if="orderLine.graphicCode && colourWays.length || orderLine.colourWayCode"
            >
              <label for="colourWayCode" class="small my-0">Colour Way:</label>
              <select
                class="form-control form-control-sm"
                id="colourWayCode"
                v-model="orderLine.colourWayCode"
              >
                <option value="MSS">Moss</option>
                <option value="RSK">Risk</option>
                <option value="DEJ">Deep Jade</option>
                <option value="LCH">Lichen</option>
                <option value="LGR">Light Grey</option>
              </select>
            </div>
          </div>
          <!-- COLOURS -->
          <div class="row" v-if="orderLine.graphicColours > 0 || orderLine.colour1">
            <div class="form-group mb-1 col-sm-4">
              <label for="colour1" class="small my-0">Colour 1:</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="colour1"
                v-model.trim="orderLine.colour1"
              >
            </div>
            <div
              class="form-group mb-1 col-sm-4"
              v-if="orderLine.graphicColours >= 2 || orderLine.colour2"
            >
              <label for="colour2" class="small my-0">Colour 2:</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="colour2"
                v-model.trim="orderLine.colour2"
              >
            </div>
            <div
              class="form-group mb-1 col-sm-4"
              v-if="orderLine.graphicColours == 3 || orderLine.colour"
            >
              <label for="colour3" class="small my-0">Colour 3:</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="colour3"
                v-model.trim="orderLine.colour3"
              >
            </div>
          </div>
        </div>
        <div class="col-sm-3 border-left">
          <div class="form-group mb-1 col-sm-12">
            <label for="tracingCharge" class="small my-0">Tracing:</label>
            <input
              type="number"
              class="form-control form-control-sm"
              id="tracingCharge"
              v-model.number="orderLine.tracingCharge"
            >
          </div>
          <div class="form-group mb-1 col-sm-12">
            <label for="creativeCharge" class="small my-0">Creative:</label>
            <input
              type="number"
              class="form-control form-control-sm"
              id="creativeCharge"
              v-model.number="orderLine.creativeCharge"
            >
          </div>
          <div class="form-group mb-1 col-sm-12">
            <label for="scaledArtCharge" class="small my-0">Scaled Art:</label>
            <input
              type="number"
              class="form-control form-control-sm"
              id="creativeCharge"
              v-model.number="orderLine.scaledArtCharge"
            >
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer bg-dark text-light p-2">
      <button
        type="button"
        class="btn btn-sm btn-success d-print-none float-right"
        @click.prevent="commitLine"
      >Commit Changes</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditLine",
  data() {
    return {
      lineIndex: this.$route.params.lineIndex,
      colourWays: [],
      selectedOption: ""
    };
  },
  created() {
    this.$store.dispatch("getGraphicCodes");
  },
  computed: {
    order() {
      return this.$store.state.order;
    },
    orderLine() {
      return this.$store.state.order.orderLines[this.lineIndex];
    },
    styles() {
      return this.$store.state.styles;
    },
    graphicCodes() {
      return this.$store.state.graphicCodes;
    }
  },
  methods: {
    formatPrice(value) {
      let val = (value / 1).toFixed(2);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    commitLine() {
      let {
        tracingCharge,
        scaledArtCharge,
        creativeCharge,
        graphicCode
      } = this.orderLine;

      let itemsTotal = 0;
      let items = this.orderLine.items;
      // cycles through items in the line and adds all the final item prices
      for (let x = 0; x < items.length; x++) {
        let currentItem = items[x];
        if (!currentItem.cancelled) {
          itemsTotal += currentItem.itemTotalPrice;
        }
      }

      //if line is quick design, decreases the total by 10%
      if (graphicCode != "CUSTM") {
        itemsTotal *= 0.9;
      }

      itemsTotal += tracingCharge;
      itemsTotal += scaledArtCharge;
      itemsTotal += creativeCharge;
      this.orderLine.itemsSubTotal = itemsTotal;
      this.$store.dispatch("saveOrder");
      this.$router.push({ path: `/${this.order.orderNum}` });
    },
    loadColourWays(e) {
      let index = e.target.selectedIndex;
      this.colourWays = this.$store.getters.getColourWays(index);
      this.orderLine.colourWayCode = "";
      this.orderLine.graphicColours = this.graphicCodes[index].colours;
      this.orderLine.colour1 = "";
      this.orderLine.colour2 = "";
      this.orderLine.colour3 = "";
    }
  }
};
</script>
