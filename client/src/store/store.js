import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    order: {},
    reps: [],
    provs: [],
    states: [],
    styles: [],
    sgprices2019: [],
    sgprices2020: [],
    lgstyles: [],
    lgprices2019: [],
    lgprices2020: [],
    graphicCodes: [],
    swatches: [],
    isLoading: false
  },
  actions: {
    saveOrder: ({ commit, state }) => {
      let order = state.order;

      delete order.createdAt;
      delete order.updatedAt;
      axios
        .put(`/api/orders/${state.order.orderNum}`, order)
        .then(r => r.data)
        .then(() => {
          commit("SAVE_ORDER_DATA");
        });
    },
    getOrderData: ({ commit }, orderNum) => {
      axios
        .get(`/api/orders/${orderNum}`)
        .then(r => r.data)
        .then(order => {
          commit("SET_ORDER_DATA", order);
        });
    },
    getReps: ({ commit }) => {
      axios
        .get(`/api/reps`)
        .then(r => r.data)
        .then(reps => {
          commit("SET_REPS", reps);
        });
    },
    getProvincialTaxes: ({ commit }) => {
      axios
        .get(`/api/provTax`)
        .then(r => r.data)
        .then(provTax => {
          commit("SET_PROVINCIAL_TAXES", provTax);
        });
    },
    getUSAStates: ({ commit }) => {
      axios
        .get(`/api/states`)
        .then(r => r.data)
        .then(states => {
          commit("SET_USA_STATES", states);
        });
    },
    getStyles: ({ commit }) => {
      axios
        .get(`/api/styles`)
        .then(r => r.data)
        .then(styles => {
          commit("SET_STYLES", styles);
        });
    },
    getSGPrices2019: ({ commit }) => {
      axios
        .get(`/api/styles/sg2019`)
        .then(r => r.data)
        .then(payload => {
          commit("SET_SG_PRICES_2019", payload);
        });
    },
    getSGPrices2020: ({ commit }) => {
      axios
        .get(`/api/styles/sg2020`)
        .then(r => r.data)
        .then(payload => {
          commit("SET_SG_PRICES_2020", payload);
        });
    },
    getLGStyles: ({ commit }) => {
      axios
        .get(`/api/styles/lg`)
        .then(r => r.data)
        .then(lgstyles => {
          commit("SET_LG_STYLES", lgstyles);
        });
    },
    getLGPrices2019: ({ commit }) => {
      axios
        .get(`/api/styles/lg2019`)
        .then(r => r.data)
        .then(payload => {
          commit("SET_LG_PRICES_2019", payload);
        });
    },
    getLGPrices2020: ({ commit }) => {
      axios
        .get(`/api/styles/lg2020`)
        .then(r => r.data)
        .then(payload => {
          commit("SET_LG_PRICES_2020", payload);
        });
    },
    getGraphicCodes: ({ commit }) => {
      axios
        .get(`/api/graphicCodes`)
        .then(r => r.data)
        .then(graphicCodes => {
          commit("SET_GRAPHIC_CODES", graphicCodes);
        });
    },
    getSwatches: ({ commit }) => {
      axios
        .get(`/api/swatches`)
        .then(r => r.data)
        .then(swatches => {
          commit("SET_SWATCHES", swatches);
        });
    },
    setProvTax: ({ commit }, tax) => {
      commit("SET_PROV_TAX", tax);
    },
    setCountryUpper: ({ commit, dispatch }, text) => {
      text = text.toUpperCase();
      commit("SET_COUNTRY_UPPER", text);
      commit("RESET_STATE_PROV");
      commit("SET_CURRENCY", text);
      dispatch("updateAllLines");
    },
    setAddOns: ({ commit, dispatch }, lineIndex) => {
      commit("SET_ADD_ONS", lineIndex);
      dispatch("updateAllItems", lineIndex);
      dispatch("setLineTotal", lineIndex);
    },
    updateAllLines: ({ state, dispatch }) => {
      const orderLines = state.order.orderLines;
      for (let [lineIndex, orderLine] of orderLines.entries()) {
        if (orderLine.cancelled === false) {
          const items = orderLine.items;
          for (let [itemIndex, item] of items.entries()) {
            if (item.cancelled === false) {
              dispatch("getItemUnitPrice", { lineIndex, itemIndex });
            }
          }
        }
      }
    },
    updateAllItems: ({ state, commit, dispatch }, lineIndex) => {
      const orderLine = state.order.orderLines[lineIndex];
      for (let [itemIndex, item] of orderLine.items.entries()) {
        if (item.cancelled === false) {
          commit("GET_ITEM_UNIT_PRICE", { lineIndex, itemIndex });
          commit("SET_FINAL_UNIT_PRICE", { lineIndex, itemIndex });
        }
      }
      commit("SET_LINE_TOTAL", lineIndex);
      commit("SET_ORDER_TOTALS");
      dispatch("saveOrder");
    },
    getItemUnitPrice: ({ commit, dispatch }, { lineIndex, itemIndex }) => {
      commit("GET_ITEM_UNIT_PRICE", { lineIndex, itemIndex });
      dispatch("setFinalUnitPrice", { lineIndex, itemIndex });
    },
    setSelectedStyle: ({ commit }, { lineIndex, itemIndex }) => {
      commit("SET_SELECTED_STYLE", { lineIndex, itemIndex });
    },
    setSelectedConfig: ({ commit, dispatch }, { lineIndex, itemIndex }) => {
      commit("SET_SELECTED_CONFIG", { lineIndex, itemIndex });
      dispatch("getItemUnitPrice", { lineIndex, itemIndex });
    },
    setOrderTotal: ({ commit, dispatch }) => {
      commit("SET_ORDER_TOTALS");
      dispatch("saveOrder");
    },
    setFinalUnitPrice: ({ commit, dispatch }, { lineIndex, itemIndex }) => {
      commit("SET_FINAL_UNIT_PRICE", { lineIndex, itemIndex });
      dispatch("setLineTotal", lineIndex);
    },
    setLineTotal: ({ commit, dispatch }, lineIndex) => {
      commit("SET_LINE_TOTAL", lineIndex);
      dispatch("setOrderTotal");
    },
    addLine: ({ commit, state }) => {
      return new Promise((resolve, reject) => {
        const lineLength = state.order.orderLines.length;
        let nextLineNumber = parseInt(lineLength + 1);
        if (nextLineNumber < 10) {
          nextLineNumber = "0" + nextLineNumber;
        } else {
          nextLineNumber = nextLineNumber.toString();
        }
        state.isLoading = true;
        axios
          .put(`/api/orders/${state.order.orderNum}/${nextLineNumber}`)
          .then(r => r.data)
          .then(order => {
            commit("SET_ORDER_DATA", order);
            state.isLoading = false;
            resolve(lineLength);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    cancelLine: ({ commit, dispatch }, lineIndex) => {
      commit("CANCEL_LINE", lineIndex);
      dispatch("saveOrder");
      dispatch("updateAllLines");
    },
    addItem: ({ commit, state }, lineIndex) => {
      return new Promise((resolve, reject) => {
        const itemLength = state.order.orderLines[lineIndex].items.length;
        let nextItemNumber = parseInt(itemLength + 1);
        if (nextItemNumber < 10) {
          nextItemNumber = "0" + nextItemNumber;
        } else {
          nextItemNumber = nextItemNumber.toString();
        }
        state.isLoading = true;
        axios
          .put(
            `/api/orders/${state.order.orderNum}/${lineIndex}/${nextItemNumber}`
          )
          .then(r => r.data)
          .then(order => {
            commit("SET_ORDER_DATA", order);
            state.isLoading = false;
            resolve(itemLength);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    cancelItem: ({ commit, dispatch }, { lineIndex, itemIndex }) => {
      commit("CANCEL_ITEM", { lineIndex, itemIndex });
      dispatch("setAddOns", lineIndex);
      dispatch("saveOrder");
      dispatch("updateAllLines");
    },
    setHeaderTitle: ({ commit, dispatch }) => {
      commit("SET_HEADER_TITLE");
      dispatch("saveOrder");
    }
  },
  mutations: {
    SET_ORDER_DATA: (state, order) => {
      state.order = order;
    },
    SAVE_ORDER_DATA: () => {
      // just to show mutation in vuex dev window
    },
    SET_REPS: (state, reps) => {
      state.reps = reps;
    },
    SET_PROVINCIAL_TAXES: (state, provs) => {
      state.provs = provs;
    },
    SET_USA_STATES: (state, states) => {
      state.states = states;
    },
    SET_STYLES: (state, styles) => {
      state.styles = styles;
    },
    SET_SG_PRICES_2019: (state, payload) => {
      state.sgprices2019 = payload;
    },
    SET_SG_PRICES_2020: (state, payload) => {
      state.sgprices2020 = payload;
    },
    SET_LG_STYLES: (state, lgstyles) => {
      state.lgstyles = lgstyles;
    },
    SET_LG_PRICES_2019: (state, payload) => {
      state.lgprices2019 = payload;
    },
    SET_LG_PRICES_2020: (state, payload) => {
      state.lgprices2020 = payload;
    },
    SET_GRAPHIC_CODES: (state, graphicCodes) => {
      state.graphicCodes = graphicCodes;
    },
    SET_SWATCHES: (state, swatches) => {
      state.swatches = swatches;
    },
    SET_FLO: (state, { lineIndex, itemIndex, inkType }) => {
      state.order.orderLines[lineIndex].items[itemIndex].inkType = inkType;
    },
    SET_PROV_TAX: (state, tax) => {
      if (tax > 0) {
        state.order.taxes = tax;
      } else {
        state.order.taxes = 0;
      }
    },
    SET_CURRENCY: (state, text) => {
      if (text === "CA" || text === "CAN" || text === "CANADA") {
        state.order.currency = "CAD";
      } else {
        state.order.currency = "USD";
      }
    },
    SET_COUNTRY_UPPER: (state, text) => {
      state.order.shipToCountry = text;
    },
    RESET_STATE_PROV: state => {
      state.order.shipToProvState = null;
      state.order.taxes = null;
    },
    SET_ITEM_TOTAL_UNITS: (state, { lineIndex, itemIndex }) => {
      let { one, xxs, xs, s, m, l, xl, xxl, xxxl } = state.order.orderLines[
        lineIndex
      ].items[itemIndex];
      if (one == null || one == "") {
        one = 0;
      }
      if (xxs == null || xxs == "") {
        xxs = 0;
      }
      if (xs == null || xs == "") {
        xs = 0;
      }
      if (s == null || s == "") {
        s = 0;
      }
      if (m == null || m == "") {
        m = 0;
      }
      if (l == null || l == "") {
        l = 0;
      }
      if (xl == null || xl == "") {
        xl = 0;
      }
      if (xxl == null || xxl == "") {
        xxl = 0;
      }
      if (xxxl == null || xxxl == "") {
        xxxl = 0;
      }
      let totalsArray = [one, xxs, xs, s, m, l, xl, xxl, xxxl];
      state.order.orderLines[lineIndex].items[
        itemIndex
      ].totalUnits = totalsArray.reduce((previous, current) => {
        return previous + current;
      });
    },
    ADD_ONS: (state, { lineIndex, itemIndex }) => {
      let item = state.order.orderLines[lineIndex].items[itemIndex];

      const msrOrder =
        state.order.orderLines[lineIndex].lineJobType === "MSR" ? true : false;

      let addOns = 0;

      if (item.personalization && !msrOrder) {
        addOns += 10.0;
      }

      if (item.zap && !msrOrder) {
        addOns += 5.0;
      }

      state.order.orderLines[lineIndex].items[itemIndex].addOns = addOns;
    },
    SET_SELECTED_STYLE: (state, { lineIndex, itemIndex }) => {
      let item = state.order.orderLines[lineIndex].items[itemIndex];
      let { selectedStyle } = item;

      if (
        state.order.orderLines[lineIndex].useLGPricing ||
        state.order.lgOrder
      ) {
        item.configs = state.lgstyles[selectedStyle].configurations;
        item.zipperOptions = state.lgstyles[selectedStyle].zipperOptions;
        item.contrastOptions = state.lgstyles[selectedStyle].contrastOptions;
      } else {
        item.configs = state.styles[selectedStyle].configurations;
        item.zipperOptions = state.styles[selectedStyle].zipperOptions;
        item.contrastOptions = state.styles[selectedStyle].contrastOptions;
      }

      item.selectedConfig = -1;
      item.zipper = null;
      item.contrast = null;

      item.one = 0;
      item.xxs = 0;
      item.xs = 0;
      item.s = 0;
      item.m = 0;
      item.l = 0;
      item.xl = 0;
      item.xxl = 0;
      item.xxxl = 0;

      item.autobahnCode = null;
      item.jbaCode = null;
      item.sizeRange = null;
      item.styleCode = null;
      item.extendedDescription = null;
      item.unitPrice = 0;
      item.finalUnitPrice = 0;
      item.totalUnits = 0;
    },
    SET_SELECTED_CONFIG: (state, { lineIndex, itemIndex }) => {
      const item = state.order.orderLines[lineIndex].items[itemIndex];
      const { selectedStyle, selectedConfig } = item;

      let autobahnCode;
      let jbaCode;
      let sizeRange;
      let styleCode;
      let extendedDescription;

      if (
        state.order.orderLines[lineIndex].useLGPricing ||
        state.order.lgOrder
      ) {
        autobahnCode =
          state.lgstyles[selectedStyle].configurations[selectedConfig]
            .autobahnCode;
        jbaCode =
          state.lgstyles[selectedStyle].configurations[selectedConfig].jbaCode;
        sizeRange =
          state.lgstyles[selectedStyle].configurations[selectedConfig]
            .sizeRange;
        styleCode =
          state.lgstyles[selectedStyle].configurations[selectedConfig]
            .styleCode;
        extendedDescription =
          state.lgstyles[selectedStyle].configurations[selectedConfig]
            .extendedDescription;
      } else {
        autobahnCode =
          state.styles[selectedStyle].configurations[selectedConfig]
            .autobahnCode;
        jbaCode =
          state.styles[selectedStyle].configurations[selectedConfig].jbaCode;
        sizeRange =
          state.styles[selectedStyle].configurations[selectedConfig].sizeRange;
        styleCode =
          state.styles[selectedStyle].configurations[selectedConfig].styleCode;
        extendedDescription =
          state.styles[selectedStyle].configurations[selectedConfig]
            .extendedDescription;
      }

      item.autobahnCode = autobahnCode;
      item.jbaCode = jbaCode;
      item.sizeRange = sizeRange;
      item.styleCode = styleCode;
      item.extendedDescription = extendedDescription;

      item.addOns = 0;

      if (item.extendedDescription.includes("ZAP")) {
        item.zap = true;
      } else {
        item.zap = false;
      }

      const msrOrder =
        state.order.orderLines[lineIndex].lineJobType === "MSR" ? true : false;
      if (item.personalization && item.zap && !msrOrder) {
        item.addOns = 15;
      } else if (item.personalization && !item.zap && !msrOrder) {
        item.addOns = 10;
      } else if (!item.personalization && item.zap && !msrOrder) {
        item.addOns = 5;
      }

      item.zipper = null;
      item.contrast = null;
      item.one = 0;
      item.xxs = 0;
      item.xs = 0;
      item.s = 0;
      item.m = 0;
      item.l = 0;
      item.xl = 0;
      item.xxl = 0;
      item.xxxl = 0;
      item.unitPrice = 0;
      item.finalUnitPrice = 0;
      item.totalUnits = 0;
    },
    GET_ITEM_UNIT_PRICE: (state, { lineIndex, itemIndex }) => {
      const item = state.order.orderLines[lineIndex].items[itemIndex];
      const { selectedStyle, selectedConfig, styleCode } = item;
      const currency = state.order.currency;
      const priceBreak = state.order.orderLines[lineIndex].priceBreak;

      // GET CONFIGURATION DATA FROM OLD PRICE COLLECTIONS if using 2019 pricelist
      let config2019;
      let config2020;
      if (!state.order.use2020Pricing) {
        if (
          state.order.lgOrder ||
          (!state.order.lgOrder &&
            state.order.orderLines[lineIndex].useLGPricing)
        ) {
          config2019 = state.lgprices2019.filter(
            el => el.styleCode === styleCode
          )[0];
        } else {
          config2019 = state.sgprices2019.filter(
            el => el.styleCode === styleCode
          )[0];
        }
      } else {
        if (
          state.order.lgOrder ||
          (!state.order.lgOrder &&
            state.order.orderLines[lineIndex].useLGPricing)
        ) {
          config2020 = state.lgprices2020.filter(
            el => el.styleCode === styleCode
          )[0];
        } else {
          config2020 = state.sgprices2020.filter(
            el => el.styleCode === styleCode
          )[0];
        }
      }

      // GET CONFIGURATION DATA FROM LGSTYLES or SGSTYLES
      let currentConfig;
      if (
        state.order.lgOrder ||
        (!state.order.lgOrder && state.order.orderLines[lineIndex].useLGPricing)
      ) {
        currentConfig =
          state.lgstyles[selectedStyle].configurations[selectedConfig];
      } else {
        currentConfig =
          state.styles[selectedStyle].configurations[selectedConfig];
      }

      let unitPrice =
        state.order.orderLines[lineIndex].items[itemIndex].unitPrice;

      let unitCost =
        state.order.orderLines[lineIndex].items[itemIndex].unitCost;

      state.order.orderLines[lineIndex].items[itemIndex].brand =
        currentConfig.brand;

      state.order.orderLines[lineIndex].items[itemIndex].gender =
        currentConfig.gender;

      state.order.orderLines[lineIndex].items[itemIndex].fabric =
        currentConfig.fabric;

      if (!state.order.use2020Pricing) {
        unitCost = config2019.costUSD;

        state.order.orderLines[lineIndex].items[itemIndex].usdTariff =
          config2019.usdTariff;

        state.order.orderLines[lineIndex].items[itemIndex].cadTariff =
          config2019.cadTariff;

        if (selectedConfig > -1) {
          if (currency === "CAD") {
            unitPrice = config2019[`cad${priceBreak.toString()}`];
          } else {
            unitPrice = config2019[`usd${priceBreak.toString()}`];
          }
        }
      } else {
        unitCost = config2020.costUSD;

        state.order.orderLines[lineIndex].items[itemIndex].usdTariff =
          config2020.usdTariff;

        state.order.orderLines[lineIndex].items[itemIndex].cadTariff =
          config2020.cadTariff;

        if (selectedConfig > -1) {
          if (currency === "CAD") {
            unitPrice = config2020[`cad${priceBreak.toString()}`];
          } else {
            unitPrice = config2020[`usd${priceBreak.toString()}`];
          }
        }
      }

      state.order.orderLines[lineIndex].items[itemIndex].unitPrice = unitPrice;
      state.order.orderLines[lineIndex].items[itemIndex].unitCost = unitCost;
    },
    SET_ORDER_TOTALS: state => {
      state.order.beforeTaxes = 0;
      state.order.qty = 0;
      const orderLines = state.order.orderLines;
      let msrOrder = false;
      for (let orderLine of orderLines) {
        if (orderLine.cancelled === false) {
          state.order.beforeTaxes += orderLine.itemsSubTotal;
          state.order.qty += orderLine.lineItemsQty;
        }
        if (orderLine.lineJobType === "MSR") {
          msrOrder = true;
        }
      }

      if (!msrOrder) {
        state.order.beforeTaxes += state.order.multiShips * 15;
        state.order.beforeTaxes += state.order.prePacks * 5;
      }

      if (state.order.priorityShipping && !msrOrder) {
        state.order.beforeTaxes += state.order.priorityShipping;
      }

      if (state.order.revisionCharge && !msrOrder) {
        state.order.beforeTaxes += state.order.revisionCharge;
      }

      state.order.taxAmount =
        state.order.beforeTaxes * (state.order.taxes / 100);
      state.order.netValue = state.order.beforeTaxes + state.order.taxAmount;
      state.order.balanceOutstanding =
        state.order.netValue -
        state.order.onTermPayment -
        state.order.isrCollectedOrig -
        state.order.kitOrderPayment +
        state.order.isrRefunded;
      if (state.order.balanceOutstanding > 0) {
        state.order.paymentStatus = "Balance Outstanding";
      } else if (state.order.balanceOutstanding < 0) {
        state.order.paymentStatus = "Refund Customer";
      } else if (state.order.balanceOutstanding == 0) {
        state.order.paymentStatus = "Complete";
      }
    },
    SET_ADD_ONS: (state, lineIndex) => {
      let totalAddOns = 0;
      const tracingCharge = state.order.orderLines[lineIndex].tracingCharge;
      const creativeCharge = state.order.orderLines[lineIndex].creativeCharge;
      const scaledArtCharge = state.order.orderLines[lineIndex].scaledArtCharge;
      const colourWashCharge =
        state.order.orderLines[lineIndex].colourWashCharge;

      const items = state.order.orderLines[lineIndex].items;
      const msrOrder =
        state.order.orderLines[lineIndex].lineJobType === "MSR" ? true : false;
      for (let item of items) {
        if (item.cancelled === false && !msrOrder) {
          totalAddOns += item.addOns * item.totalUnits;
        }
      }

      if (tracingCharge && !msrOrder) {
        totalAddOns += tracingCharge;
      }

      if (creativeCharge && !msrOrder) {
        totalAddOns += creativeCharge;
      }

      if (scaledArtCharge && !msrOrder) {
        totalAddOns += scaledArtCharge;
      }

      if (colourWashCharge && !msrOrder) {
        totalAddOns += colourWashCharge;
      }
      state.order.orderLines[lineIndex].totalAddOns = totalAddOns;
    },
    SET_FINAL_UNIT_PRICE: (state, { lineIndex, itemIndex }) => {
      const order = state.order;
      const orderLine = order.orderLines[lineIndex];
      const { graphicCode, priceBreak } = orderLine;

      const item = orderLine.items[itemIndex];
      const {
        unitPrice,
        itemDiscountType,
        itemDiscount,
        totalUnits,
        brand
      } = item;

      let qdDiscountAmount = 0;

      if (order.use2020Pricing) {
        if (graphicCode !== "CUSTM" && graphicCode !== null) {
          if (brand.toUpperCase() !== "SOMBRIO") {
            qdDiscountAmount = unitPrice * 0.1;
          } else {
            qdDiscountAmount = 7.0;
          }
        }
      } else {
        if (graphicCode !== "CUSTM" && graphicCode !== null) {
          if (
            priceBreak == 2 ||
            priceBreak == 6 ||
            priceBreak == 12 ||
            priceBreak == 24
          ) {
            qdDiscountAmount = unitPrice * 0.1;
          }
        }
      }

      let finalUnitPrice = 0;

      if (itemDiscountType === "$") {
        finalUnitPrice = unitPrice - itemDiscount - qdDiscountAmount;
      } else {
        state.order.orderLines[lineIndex].items[itemIndex].itemDiscountType =
          "%";

        finalUnitPrice =
          unitPrice - unitPrice * (itemDiscount / 100) - qdDiscountAmount;
      }

      state.order.orderLines[lineIndex].items[
        itemIndex
      ].finalUnitPrice = finalUnitPrice;

      state.order.orderLines[lineIndex].items[itemIndex].itemTotalPrice =
        totalUnits * finalUnitPrice;
    },
    SET_LINE_TOTAL: (state, lineIndex) => {
      const orderLine = state.order.orderLines[lineIndex];
      const items = orderLine.items;
      const totalAddOns = orderLine.totalAddOns;

      let itemsTotal = 0;
      let itemsQty = 0;
      for (let item of items) {
        if (item.cancelled === false) {
          itemsTotal += item.itemTotalPrice;
          itemsQty += item.totalUnits;
        }
      }
      if (totalAddOns > 0) {
        itemsTotal += totalAddOns;
      }
      state.order.orderLines[lineIndex].lineItemsQty = itemsQty;
      state.order.orderLines[lineIndex].itemsSubTotal = itemsTotal;
    },
    CANCEL_LINE: (state, lineIndex) => {
      for (let [itemIndex, item] of state.order.orderLines[
        lineIndex
      ].items.entries()) {
        state.order.orderLines[lineIndex].items[itemIndex].cancelled = true;
      }
      state.order.orderLines[lineIndex].cancelled = true;
    },
    CANCEL_ITEM: (state, { lineIndex, itemIndex }) => {
      state.order.orderLines[lineIndex].items[itemIndex].cancelled = true;
    },
    SET_HEADER_TITLE: (state, quoteToggle) => {
      state.order.quoteToggle = !state.order.quoteToggle;
    }
  },
  getters: {
    lgprices2019: state => state.lgprices2019,
    sgprices2019: state => state.sgprices2019,
    lgprices2020: state => state.lgprices2020,
    sgprices2020: state => state.sgprices2020,
    getColourWays: state => index => {
      return state.graphicCodes[index].colourWays;
    },
    totalBeforeAddOns: state => lineIndex => {
      const orderLine = state.order.orderLines[lineIndex];
      let totalBeforeAddOns = 0;
      for (let item of orderLine.items) {
        if (item.cancelled === false) {
          totalBeforeAddOns += item.itemTotalPrice;
        }
      }
      return totalBeforeAddOns;
    },
    lineCancelled: state => lineIndex => {
      const orderLine = state.order.orderLines[lineIndex];
      return orderLine.cancelled;
    },
    itemCancelled: state => (lineIndex, itemIndex) => {
      const item = state.order.orderLines[lineIndex].items[itemIndex];
      return item.cancelled;
    },
    isLoading: state => {
      return state.isLoading;
    },
    disableEdit: state => {
      const currentStatus = state.order.currentStatus;
      if (
        currentStatus === "M. Waiting for Output" ||
        currentStatus === "N. Output - Waiting on Someone else" ||
        currentStatus === "O. Output Started" ||
        currentStatus === "P. Output Ready for QC" ||
        currentStatus === "P-1. Output QC in Progress" ||
        currentStatus === "Q. Output QC Complete" ||
        currentStatus === "R. Waiting for PNT" ||
        currentStatus === "S. PNT Ready for QC" ||
        currentStatus === "S-1. PNT QC in Progress" ||
        currentStatus === "T. PNT QC Complete" ||
        currentStatus === "U. Uploaded" ||
        currentStatus === "V. Sent to Vendor"
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
});
