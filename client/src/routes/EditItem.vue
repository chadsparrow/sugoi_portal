<template>
  <div class="item card border-dark">
    <div class="card-header bg-dark text-light p-2">
      <div>Item#: {{item.itemNumber}}</div>
    </div>
    <div class="card-body p-3">
      <div class="row align-items-center mb-2">
        <div class="col-sm-3">
          <label for="selectedStyle" class="small my-0">Style:</label>
          <select
            class="form-control form-control-sm"
            id="selectedStyle"
            v-model="item.selectedStyle"
            @change="selectStyle"
          >
            <option
              v-for="(style, index) in styles"
              :key="index"
              :index="index"
              :value="index"
            >{{style.style}}-{{style.description}}</option>
          </select>
        </div>
        <div class="col-sm-4">
          <label for="selectedConfig" class="small my-0">Config:</label>
          <select
            class="form-control form-control-sm"
            id="selectedConfig"
            v-model="item.selectedConfig"
            @change="selectConfig"
          >
            <option
              v-for="(config, index) in item.configs"
              :key="index"
              :index="index"
              :value="index"
            >{{config.extendedDescription}}</option>
          </select>
        </div>
        <div class="col-sm-3">StyleCode: {{item.styleCode}}</div>
        <div class="col-sm-2">JBA: {{item.jbaCode}}</div>
      </div>
      <div class="row align-items-center text-center">
        <div class="col-sm-2">
          <label for="inkType" class="small my-0">Ink:</label>
          <select class="form-control form-control-sm" id="inkType" v-model="item.inkType">
            <option value="D" selected>Standard</option>
            <option value="F">Fluorescent</option>
          </select>
        </div>
        <div class="col-sm-2">
          <label for="childReference" class="small my-0">Child Ref#:</label>
          <input
            type="text"
            class="form-control form-control-sm"
            id="childReference"
            v-model.trim="item.childReference"
          >
        </div>
        <div class="col-sm-1">
          <label for="thread" class="small my-0">Thread:</label>
          <select class="form-control form-control-sm" id="thread" v-model="item.thread">
            <option value="BLK">BLK</option>
            <option value="WHT">WHT</option>
            <option value="GNM">GNM</option>
            <option value="INC">INC</option>
            <option value="REF">REF</option>
            <option value="IND">IND</option>
            <option value="F1R">F1R</option>
            <option value="VPK">VPK</option>
            <option value="FLY">FLY</option>
          </select>
        </div>
        <div class="col-sm-1" v-if="item.zipperOptions.length">
          <label for="zipper" class="small my-0">Zipper:</label>
          <select class="form-control form-control-sm" id="zipper" v-model="item.zipper">
            <option v-for="(zipper, index) in item.zipperOptions" :key="index">{{zipper}}</option>
          </select>
        </div>
        <div class="col-sm-1" v-if="item.contrastOptions.length">
          <label for="contrast" class="small my-0">Contrast:</label>
          <select class="form-control form-control-sm" id="contrast" v-model="item.contrast">
            <option v-for="(contrast, index) in item.contrastOptions" :key="index">{{contrast}}</option>
          </select>
        </div>
        <div class="col-sm-1">
          <input
            class="form-check-input"
            type="checkbox"
            value="true"
            id="personalization"
            v-model="item.personalization"
          >
          <label class="form-check-label" for="personalization">PRS</label>
        </div>
        <div class="col-sm-1">
          <input
            class="form-check-input"
            type="checkbox"
            value="true"
            id="zap"
            v-model="item.zap"
            readonly
          >
          <label class="form-check-label" for="zap">ZAP</label>
        </div>
      </div>
      <hr class="my-2">
      <div
        class="row align-items-center text-center"
        v-if="item.sizeRange ==='ONE' && item.sizeRange"
      >
        <div class="form-group col-sm-2 offset-sm-5">
          <label for="one" class="small my-0">ONE</label>
          <input
            type="number"
            class="form-control form-control-sm text-center"
            min="0"
            step="1"
            id="one"
            v-model.number="item.one"
          >
        </div>
      </div>
      <div
        class="row align-items-center text-center"
        v-else-if="item.sizeRange !=='ONE' && item.sizeRange"
      >
        <div class="form-group col" v-if="item.sizeRange.includes('2XS')">
          <label for="xxs" class="small my-0">2XS</label>
          <input
            type="number"
            class="form-control form-control-sm text-center"
            min="0"
            step="1"
            id="xxs"
            v-model.number="item.xxs"
          >
        </div>
        <div class="form-group col">
          <label for="xs" class="small my-0">XS</label>
          <input
            type="number"
            class="form-control form-control-sm text-center"
            min="0"
            step="1"
            id="xs"
            v-model.number="item.xs"
          >
        </div>
        <div class="form-group col">
          <label for="s" class="small my-0">S</label>
          <input
            type="number"
            class="form-control form-control-sm text-center"
            min="0"
            step="1"
            id="s"
            v-model.number="item.s"
          >
        </div>
        <div class="form-group col">
          <label for="m" class="small my-0">M</label>
          <input
            type="number"
            class="form-control form-control-sm text-center"
            min="0"
            step="1"
            id="m"
            v-model.number="item.m"
          >
        </div>
        <div class="form-group col">
          <label for="l" class="small my-0">L</label>
          <input
            type="number"
            class="form-control form-control-sm text-center"
            min="0"
            step="1"
            id="l"
            v-model.number="item.l"
          >
        </div>
        <div class="form-group col">
          <label for="xl" class="small my-0">XL</label>
          <input
            type="number"
            class="form-control form-control-sm text-center"
            min="0"
            step="1"
            id="xl"
            v-model.number="item.xl"
          >
        </div>
        <div
          class="form-group col"
          v-if="item.sizeRange.includes('2XL') || item.sizeRange.includes('3XL')"
        >
          <label for="xxl" class="small my-0">2XL</label>
          <input
            type="number"
            class="form-control form-control-sm text-center"
            min="0"
            step="1"
            id="xxl"
            v-model.number="item.xxl"
          >
        </div>
        <div class="form-group col" v-if="item.sizeRange.includes('3XL')">
          <label for="xxxl" class="small my-0">3XL</label>
          <input
            type="number"
            class="form-control form-control-sm text-center"
            min="0"
            id="xxxl"
            v-model.number="item.xxxl"
          >
        </div>
      </div>
      <hr class="my-2">
      <div class="row p-0 m-0 align-items-center text-center">
        <div class="col text-center">Total Units
          <br>
          <span>{{unitTotal}}</span>
        </div>

        <div class="col">
          Unit Price ({{orderLine.priceBreak}})
          <br>
          <span>$ {{formatPrice(unitPrice)}}</span>
        </div>

        <div class="col">Add-Ons
          <br>
          <span>$ {{formatPrice(addOns)}}</span>
        </div>

        <div class="col">
          <label for="itemDiscount" class="small my-0">Discount %</label>
          <input
            type="number"
            class="form-control form-control-sm text-center"
            min="0"
            step=".5"
            id="itemDiscount"
            v-model.number="item.itemDiscount"
            style="font-weight: bold; font-size: 14px;"
          >
        </div>

        <div class="col">Final Unit Price
          <br>
          <span>$ {{formatPrice(finalUnitPrice)}}</span>
        </div>
      </div>
    </div>
    <div class="card-footer bg-dark text-light text-right p-2">
      <button class="btn btn-sm btn-success mr-1" @click.prevent="commitItem">Commit Item</button>
      <!-- <div class="form-check float-left ml-3">
        <input
          class="form-check-input"
          type="checkbox"
          value="true"
          id="sketch"
          v-model="item.sketch"
        >
        <label class="form-check-label" for="sketh">Sketch</label>
      </div>-->
    </div>
  </div>
</template>

<script>
export default {
  name: "EditItem",
  data() {
    return {
      index: this.$route.params.index,
      lineIndex: this.$route.params.lineIndex
    };
  },
  computed: {
    order() {
      return this.$store.state.order;
    },
    orderLine() {
      return this.$store.state.order.orderLines[this.lineIndex];
    },
    item() {
      return this.$store.state.order.orderLines[this.lineIndex].items[
        this.index
      ];
    },
    styles() {
      return this.$store.state.styles;
    },
    unitTotal() {
      return (
        this.item.one +
        this.item.xxs +
        this.item.xs +
        this.item.s +
        this.item.m +
        this.item.l +
        this.item.xl +
        this.item.xxl +
        this.item.xxxl
      );
    },
    unitPrice() {
      if (this.order.currency === "CAD" && this.item.selectedConfig > -1) {
        switch (this.orderLine.priceBreak) {
          case 1:
            return this.styles[this.item.selectedStyle].configurations[
              this.item.selectedConfig
            ].cad1;
            break;
          case 6:
            return this.styles[this.item.selectedStyle].configurations[
              this.item.selectedConfig
            ].cad6;
            break;
          case 12:
            return this.styles[this.item.selectedStyle].configurations[
              this.item.selectedConfig
            ].cad12;
            break;
          case 24:
            return this.styles[this.item.selectedStyle].configurations[
              this.item.selectedConfig
            ].cad24;
            break;
          case 50:
            return this.styles[this.item.selectedStyle].configurations[
              this.item.selectedConfig
            ].cad50;
            break;
          case 100:
            return this.styles[this.item.selectedStyle].configurations[
              this.item.selectedConfig
            ].cad100;
            break;
          case 200:
            return this.styles[this.item.selectedStyle].configurations[
              this.item.selectedConfig
            ].cad200;
            break;
          case 500:
            return this.styles[this.item.selectedStyle].configurations[
              this.item.selectedConfig
            ].cad500;
            break;
        }
      } else if (
        this.order.currency === "USD" &&
        this.item.selectedConfig > -1
      ) {
        switch (this.orderLine.priceBreak) {
          case 1:
            return this.styles[this.item.selectedStyle].configurations[
              this.item.selectedConfig
            ].usd1;
            break;
          case 6:
            return this.styles[this.item.selectedStyle].configurations[
              this.item.selectedConfig
            ].usd6;
            break;
          case 12:
            return this.styles[this.item.selectedStyle].configurations[
              this.item.selectedConfig
            ].usd12;
            break;
          case 24:
            return this.styles[this.item.selectedStyle].configurations[
              this.item.selectedConfig
            ].usd24;
            break;
          case 50:
            return this.styles[this.item.selectedStyle].configurations[
              this.item.selectedConfig
            ].usd50;
            break;
          case 100:
            return this.styles[this.item.selectedStyle].configurations[
              this.item.selectedConfig
            ].usd100;
            break;
          case 200:
            return this.styles[this.item.selectedStyle].configurations[
              this.item.selectedConfig
            ].usd200;
            break;
          case 500:
            return this.styles[this.item.selectedStyle].configurations[
              this.item.selectedConfig
            ].usd500;
            break;
        }
      } else {
        return 0;
      }
    },
    addOns() {
      if (this.item.zap && this.item.personalization) {
        return 10;
      } else if (this.item.zap && !this.item.personalization) {
        return 5;
      } else if (!this.item.zap && this.item.personalization) {
        return 5;
      } else {
        return 0;
      }
    },
    finalUnitPrice() {
      let subUnitPrice = this.unitPrice + this.addOns;
      return subUnitPrice - subUnitPrice * (this.item.itemDiscount / 100);
    },
    finalTotalPrice() {
      return this.finalUnitPrice * this.unitTotal;
    }
  },
  methods: {
    formatPrice(value) {
      let val = (value / 1).toFixed(2);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    selectStyle() {
      let { selectedStyle } = this.item;
      this.item.configs = this.styles[selectedStyle].configurations;
      this.item.zipperOptions = this.styles[selectedStyle].zipperOptions;
      this.item.contrastOptions = this.styles[selectedStyle].contrastOptions;
      this.item.selectedConfig = -1;
      this.item.zipper = null;
      this.item.contrast = null;
    },
    selectConfig(e) {
      let index = e.target.selectedIndex;
      this.item.selectedConfig = index;
      if (index > -1) {
        let { selectedStyle } = this.item;

        let {
          autobahnCode,
          jbaCode,
          sizeRange,
          styleCode,
          extendedDescription
        } = this.styles[selectedStyle].configurations[index];

        this.item.autobahnCode = autobahnCode;
        this.item.jbaCode = jbaCode;
        this.item.sizeRange = sizeRange;
        this.item.styleCode = styleCode;
        this.item.extendedDescription = extendedDescription;

        if (this.item.extendedDescription.includes("ZAP")) {
          this.item.zap = true;
        } else {
          this.item.zap = false;
        }

        this.item.one = 0;
        this.item.xxs = 0;
        this.item.xs = 0;
        this.item.s = 0;
        this.item.m = 0;
        this.item.l = 0;
        this.item.xl = 0;
        this.item.xxl = 0;
        this.item.xxxl = 0;
      }
    },
    commitItem() {
      this.item.totalUnits = this.unitTotal;
      this.item.unitPrice = this.unitPrice;
      this.item.addOns = this.addOns;
      this.item.finalUnitPrice = this.finalUnitPrice;
      this.item.itemTotalPrice = this.finalTotalPrice;

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

      this.$store.dispatch("saveOrder", this.order);
      this.$router.push({ path: `/${this.order.orderNum}` });
    }
  }
};
</script>

<style scoped>
span {
  font-weight: bold;
  font-size: 14px;
}
</style>
