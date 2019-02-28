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
            ref="styleInput"
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
        <div class="col">
          <label for="inkType" class="small my-0">Ink:</label>
          <select class="form-control form-control-sm" id="inkType" v-model="item.inkType">
            <option value="D" selected>Standard</option>
            <option value="F">Fluorescent</option>
          </select>
        </div>
        <div class="col">
          <label for="childReference" class="small my-0">Child Ref#:</label>
          <input
            type="text"
            class="form-control form-control-sm"
            id="childReference"
            v-model.trim="item.childReference"
          >
        </div>
        <div class="col">
          <label for="thread" class="small my-0">Thread:</label>
          <select
            class="form-control form-control-sm"
            id="thread"
            v-model="item.thread"
            ref="threadInput"
          >
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
        <div class="col" v-if="item.zipperOptions.length">
          <label for="zipper" class="small my-0">Zipper:</label>
          <select
            class="form-control form-control-sm"
            id="zipper"
            v-model="item.zipper"
            ref="zipperInput"
          >
            <option v-for="(zipper, index) in item.zipperOptions" :key="index">{{zipper}}</option>
          </select>
        </div>
        <div class="col" v-if="item.contrastOptions.length">
          <label for="contrast" class="small my-0">Contrast:</label>
          <select
            class="form-control form-control-sm"
            id="contrast"
            v-model="item.contrast"
            ref="contrastInput"
          >
            <option v-for="(contrast, index) in item.contrastOptions" :key="index">{{contrast}}</option>
          </select>
        </div>
        <div class="col">
          <input
            class="form-check-input"
            type="checkbox"
            value="true"
            id="personalization"
            v-model="item.personalization"
            @change="addOns"
          >
          <label class="form-check-label" for="personalization">PRS - $10</label>
        </div>
        <div class="col">
          <input
            class="form-check-input"
            type="checkbox"
            value="true"
            id="zap"
            v-model="item.zap"
            disabled
          >
          <label class="form-check-label" for="zap">ZAP - $5</label>
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
            @change="setTotalUnits"
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
            @change="setTotalUnits"
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
            @change="setTotalUnits"
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
            @change="setTotalUnits"
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
            @change="setTotalUnits"
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
            @change="setTotalUnits"
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
            @change="setTotalUnits"
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
            @change="setTotalUnits"
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
            @change="setTotalUnits"
          >
        </div>
      </div>
      <hr class="my-2">
      <div class="row p-0 m-0 align-items-center text-center">
        <div class="col text-center">Total Units
          <br>
          <span>{{item.totalUnits}}</span>
        </div>

        <div class="col">
          Unit Price ({{order.currency}}{{priceBreak}})
          <br>
          <span>$ {{formatPrice(unitPrice)}}</span>
        </div>

        <div class="col">
          <label for="itemDiscount" class="small my-0">Discount % - ${{formatPrice(discountAmount)}}</label>
          <input
            type="number"
            class="form-control form-control-sm text-center"
            min="0"
            step=".5"
            id="itemDiscount"
            @change="finalUnitPrice"
            v-model.number="item.itemDiscount"
            style="font-weight: bold; font-size: 14px;"
          >
        </div>

        <div class="col">Final Unit Price
          <br>
          <span>$ {{formatPrice(item.finalUnitPrice)}}</span>
        </div>
      </div>
    </div>
    <div class="card-footer bg-dark text-light text-right p-2">
      <button class="btn btn-sm btn-success mr-1" @click.prevent="commitItem">Commit Item</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditItem",
  data() {
    return {
      itemIndex: this.$route.params.itemIndex,
      lineIndex: this.$route.params.lineIndex
    };
  },
  computed: {
    order() {
      return this.$store.state.order;
    },
    item() {
      return this.$store.state.order.orderLines[this.lineIndex].items[
        this.itemIndex
      ];
    },
    styles() {
      return this.$store.state.styles;
    },
    priceBreak() {
      return this.$store.state.order.orderLines[this.lineIndex].priceBreak;
    },
    unitPrice() {
      return this.$store.state.order.orderLines[this.lineIndex].items[
        this.itemIndex
      ].unitPrice;
    },
    discountAmount() {
      return this.item.unitPrice * (this.item.itemDiscount / 100);
    }
  },
  methods: {
    formatPrice(value) {
      let val = (value / 1).toFixed(2);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    selectStyle() {
      if (this.item.selectedStyle != -1) {
        this.$store.dispatch("setSelectedStyle", {
          lineIndex: this.lineIndex,
          itemIndex: this.itemIndex
        });
      }
    },
    selectConfig() {
      if (
        this.item.selectedConfig !== undefined ||
        this.item.selectedConfig > -1
      ) {
        this.$store.dispatch("setSelectedConfig", {
          lineIndex: this.lineIndex,
          itemIndex: this.itemIndex
        });
      }
    },
    setTotalUnits() {
      this.$store.commit("SET_ITEM_TOTAL_UNITS", {
        lineIndex: this.lineIndex,
        itemIndex: this.itemIndex
      });
    },
    addOns() {
      this.$store.commit("ADD_ONS", {
        lineIndex: this.lineIndex,
        itemIndex: this.itemIndex
      });
    },
    finalUnitPrice() {
      this.$store.dispatch("setFinalUnitPrice", {
        lineIndex: this.lineIndex,
        itemIndex: this.itemIndex
      });
    },
    commitItem() {
      if (this.$refs.threadInput.value === "") {
        this.$refs.threadInput.focus();
        alert("Thread not selected!");
        return;
      }
      if (
        this.$refs.zipperInput != undefined &&
        this.$refs.zipperInput.value === ""
      ) {
        this.$refs.zipperInput.focus();
        alert("Zipper not selected!");
        return;
      }

      if (
        this.$refs.contrastInput != undefined &&
        this.$refs.contrastInput.value === ""
      ) {
        this.$refs.contrastInput.focus();
        alert("Contrast not selected!");
        return;
      }

      this.$store.dispatch("setAddOns", this.lineIndex);
      this.$store.dispatch("setFinalUnitPrice", {
        lineIndex: this.lineIndex,
        itemIndex: this.itemIndex
      });
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
