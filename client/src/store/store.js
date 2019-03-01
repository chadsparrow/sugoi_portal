import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(Vuex);
Vue.use(VueAxios, axios);

export const store = new Vuex.Store({
  state: {
    order: {},
    reps: [],
    provs: [],
    states: [],
    styles: [],
    graphicCodes: []
  },
  actions: {
    saveOrder: ({ commit, state }) => {
      axios
        .put(`https://localhost:5000/api/orders/${state.order.orderNum}`, state.order)
        .then(r => r.data)
        .then(() => {
          commit("SAVE_ORDER_DATA");
        });
    },
    getOrderData: ({ commit }, orderNum) => {
      axios
        .get(`https://localhost:5000/api/orders/${orderNum}`)
        .then(r => r.data)
        .then(order => {
          commit("SET_ORDER_DATA", order);
        });
    },
    getReps: ({ commit }) => {
      axios
        .get(`https://localhost:5000/api/reps`)
        .then(r => r.data)
        .then(reps => {
          commit("SET_REPS", reps);
        });
    },
    getProvincialTaxes: ({ commit }) => {
      axios
        .get(`https://localhost:5000/api/provTax`)
        .then(r => r.data)
        .then(provTax => {
          commit("SET_PROVINCIAL_TAXES", provTax);
        });
    },
    getUSAStates: ({ commit }) => {
      axios
        .get(`https://localhost:5000/api/states`)
        .then(r => r.data)
        .then(states => {
          commit("SET_USA_STATES", states);
        });
    },
    getStyles: ({ commit }) => {
      axios
        .get(`https://localhost:5000/api/styles/`)
        .then(r => r.data)
        .then(styles => {
          commit("SET_STYLES", styles);
        });
    },
    getGraphicCodes: ({ commit }) => {
      axios
        .get(`https://localhost:5000/api/graphicCodes`)
        .then(r => r.data)
        .then(graphicCodes => {
          commit("SET_GRAPHIC_CODES", graphicCodes);
        });
    },
    setProvTax: ({ commit }, tax) => {
      commit('SET_PROV_TAX', tax);
    },
    setCountryUpper: ({ commit, dispatch }, text) => {
      text = text.toUpperCase();
      commit('SET_COUNTRY_UPPER', text);
      commit('RESET_STATE_PROV');
      commit('SET_CURRENCY', text);
      dispatch('updateAllLines');
    },
    setAddOns: ({ commit, dispatch }, lineIndex) => {
      commit('SET_ADD_ONS', lineIndex);
      dispatch('updateAllItems', lineIndex);
      dispatch('setLineTotal', lineIndex);
    },
    updateAllLines: ({ state, dispatch }) => {
      const orderLines = state.order.orderLines;
      for (let [lineIndex, orderLine] of orderLines.entries()) {
        if (!orderLine.cancelled) {
          const items = orderLine.items;
          for (let [itemIndex, item] of items.entries()) {
            if (!item.cancelled) {
              dispatch('getItemUnitPrice', { lineIndex, itemIndex })

            }
          }
        }
      }
    },
    updateAllItems: ({ state, commit, dispatch }, lineIndex) => {
      const orderLine = state.order.orderLines[lineIndex];
      for (let [itemIndex, item] of orderLine.items.entries()) {
        if (!item.cancelled) {
          commit('GET_ITEM_UNIT_PRICE', { lineIndex, itemIndex });
          commit('SET_FINAL_UNIT_PRICE', { lineIndex, itemIndex });
        }
      }
      commit('SET_LINE_TOTAL', lineIndex);
      commit('SET_ORDER_TOTALS');
      dispatch('saveOrder');
    },
    getItemUnitPrice: ({ commit, dispatch }, { lineIndex, itemIndex }) => {
      commit('GET_ITEM_UNIT_PRICE', { lineIndex, itemIndex });
      dispatch('setFinalUnitPrice', { lineIndex, itemIndex });
    },
    setSelectedStyle: ({ commit }, { lineIndex, itemIndex }) => {
      commit('SET_SELECTED_STYLE', { lineIndex, itemIndex });
    },
    setSelectedConfig: ({ commit, dispatch }, { lineIndex, itemIndex }) => {
      commit('SET_SELECTED_CONFIG', { lineIndex, itemIndex });
      dispatch('getItemUnitPrice', { lineIndex, itemIndex });
    },
    setOrderTotal: ({ commit, dispatch }) => {
      commit('SET_ORDER_TOTALS');
      dispatch('saveOrder');
    },
    setFinalUnitPrice: ({ commit, dispatch }, { lineIndex, itemIndex }) => {
      commit('SET_FINAL_UNIT_PRICE', { lineIndex, itemIndex });
      dispatch('setLineTotal', lineIndex);
    },
    setLineTotal: ({ commit, dispatch }, lineIndex) => {
      commit("SET_LINE_TOTAL", lineIndex);
      dispatch('setOrderTotal');
    },
    addLine: ({ commit, state }) => {
      const lineLength = state.order.orderLines.length;
      let nextLineNumber = parseInt(lineLength + 1);
      if (nextLineNumber < 10) {
        nextLineNumber = "0" + nextLineNumber;
      } else {
        nextLineNumber = nextLineNumber.toString();
      }

      axios.put(`https://localhost:5000/api/orders/${state.order.orderNum}/${nextLineNumber}`)
        .then(r => r.data)
        .then(order => {
          commit("SET_ORDER_DATA", order);
        })
    },
    cancelLine: ({ commit, dispatch }, lineIndex) => {
      commit("CANCEL_LINE", lineIndex);
      dispatch('updateAllLines');
    },
    addItem: ({ commit, state }, lineIndex) => {
      const itemLength = state.order.orderLines[lineIndex].items.length;
      let nextItemNumber = parseInt(itemLength + 1);
      if (nextItemNumber < 10) {
        nextItemNumber = "0" + nextItemNumber;
      } else {
        nextItemNumber = nextItemNumber.toString();
      }

      axios.put(`https://localhost:5000/api/orders/${state.order.orderNum}/${lineIndex}/${nextItemNumber}`)
        .then(r => r.data)
        .then(order => {
          commit("SET_ORDER_DATA", order);
        })
    },
    cancelItem: ({ commit, dispatch }, { lineIndex, itemIndex }) => {
      commit("CANCEL_ITEM", { lineIndex, itemIndex });
      dispatch('setAddOns', lineIndex);
      dispatch('updateAllLines');
    },
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
    SET_GRAPHIC_CODES: (state, graphicCodes) => {
      state.graphicCodes = graphicCodes;
    },
    SET_PROV_TAX: (state, tax) => {
      if (tax > 0) {
        state.order.taxes = tax;
      } else {
        state.order.taxes = 0;
      }
    },
    SET_CURRENCY: (state, text) => {
      if (text === 'CA' || text === 'CAN' || text === 'CANADA') {
        state.order.currency = "CAD"
      } else if (text === 'US' || text === 'USA' || text === 'UNITED STATES' || text === "UNITED STATES OF AMERICA") {
        state.order.currency = "USD"
      } else if (text === '') {
        state.order.currency = null;
      } else if (text === null) {
        state.order.currency = null;
      }
    },
    SET_COUNTRY_UPPER: (state, text) => {
      state.order.shipToCountry = text;
    },
    RESET_STATE_PROV: (state) => {
      state.order.shipToProvState = null;
      state.order.taxes = null;
    },
    SET_ITEM_TOTAL_UNITS: (state, { lineIndex, itemIndex }) => {
      let { one, xxs, xs, s, m, l, xl, xxl, xxxl } = state.order.orderLines[lineIndex].items[itemIndex];
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
      state.order.orderLines[lineIndex].items[itemIndex].totalUnits = totalsArray.reduce((previous, current) => {
        return previous + current;
      })
    },
    ADD_ONS: (state, { lineIndex, itemIndex }) => {
      let item = state.order.orderLines[lineIndex].items[itemIndex];

      item.addOns = 0;

      if (item.personalization && item.zap) {
        item.addOns = 15;
      } else if (item.personalization && !item.zap) {
        item.addOns = 10;
      } else if (!item.personalization && item.zap) {
        item.addOns = 5;
      } else {
        item.addOns = 0;
      }
    },
    SET_SELECTED_STYLE: (state, { lineIndex, itemIndex }) => {
      let item = state.order.orderLines[lineIndex].items[itemIndex];
      let { selectedStyle } = item;
      item.configs = state.styles[selectedStyle].configurations;
      item.zipperOptions = state.styles[selectedStyle].zipperOptions;
      item.contrastOptions = state.styles[selectedStyle].contrastOptions;
      item.selectedConfig = -1;
      item.zipper = null;
      item.contrast = null;
      item.thread = null;

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

      const {
        autobahnCode,
        jbaCode,
        sizeRange,
        styleCode,
        extendedDescription
      } = state.styles[selectedStyle].configurations[selectedConfig];

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

      if (item.personalization && item.zap) {
        item.addOns = 15;
      } else if (item.personalization && !item.zap) {
        item.addOns = 10;
      } else if (!item.personalization && item.zap) {
        item.addOns = 5;
      }

      item.zipper = null;
      item.contrast = null;
      item.thread = null;
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
      const { selectedStyle, selectedConfig } = item;
      const currency = state.order.currency;
      const priceBreak = state.order.orderLines[lineIndex].priceBreak;
      const currentConfig = state.styles[selectedStyle].configurations[selectedConfig];
      let unitPrice = state.order.orderLines[lineIndex].items[itemIndex].unitPrice;
      let unitCost = state.order.orderLines[lineIndex].items[itemIndex].unitCost;
      const totalUnits = state.order.orderLines[lineIndex].items[itemIndex].totalUnits;
      const vendor = state.order.vendor;

      if (vendor === "CCN") {
        unitCost = currentConfig.costUSD[0];
      } else if (vendor === "PNR") {
        if (totalUnits >= 6 && totalUnits <= 11) {
          unitCost = currentConfig.costUSD[0];
        } else if (totalUnits >= 12 && totalUnits <= 23) {
          unitCost = currentConfig.costUSD[1];
        } else if (totalUnits >= 24 && totalUnits <= 49) {
          unitCost = currentConfig.costUSD[2];
        } else if (totalUnits >= 50 && totalUnits <= 99) {
          unitCost = currentConfig.costUSD[3];
        } else if (totalUnits >= 100 && totalUnits <= 300) {
          unitCost = currentConfig.costUSD[4];
        }
      }

      if (currency === "CAD" && selectedConfig > -1) {
        if (priceBreak === 1) {
          unitPrice = currentConfig.cad1;
        } else if (priceBreak === 6) {
          unitPrice = currentConfig.cad6;
        } else if (priceBreak === 12) {
          unitPrice = currentConfig.cad12;
        } else if (priceBreak === 24) {
          unitPrice = currentConfig.cad24;
        } else if (priceBreak === 50) {
          unitPrice = currentConfig.cad50;
        } else if (priceBreak === 100) {
          unitPrice = currentConfig.cad100;
        } else if (priceBreak === 200) {
          unitPrice = currentConfig.cad200;
        } else if (priceBreak === 500) {
          unitPrice = currentConfig.cad500;
        }
      } else if (currency === "USD" && selectedConfig > -1) {
        if (priceBreak === 1) {
          unitPrice = currentConfig.usd1;
        } else if (priceBreak === 6) {
          unitPrice = currentConfig.usd6;
        } else if (priceBreak === 12) {
          unitPrice = currentConfig.usd12;
        } else if (priceBreak === 24) {
          unitPrice = currentConfig.usd24;
        } else if (priceBreak === 50) {
          unitPrice = currentConfig.usd50;
        } else if (priceBreak === 100) {
          unitPrice = currentConfig.usd100;
        } else if (priceBreak === 200) {
          unitPrice = currentConfig.usd200;
        } else if (priceBreak === 500) {
          unitPrice = currentConfig.usd500;
        }
      }
      state.order.orderLines[lineIndex].items[itemIndex].unitPrice = unitPrice.toFixed(2);
      state.order.orderLines[lineIndex].items[itemIndex].unitCost = unitCost.toFixed(2);
    },
    SET_ORDER_TOTALS: (state) => {
      state.order.beforeTaxes = 0;
      state.order.qty = 0;
      const orderLines = state.order.orderLines;
      for (let orderLine of orderLines) {
        if (!orderLine.cancelled) {
          state.order.beforeTaxes += orderLine.itemsSubTotal;
          state.order.qty += orderLine.lineItemsQty;
        }
      }
      state.order.beforeTaxes += state.order.multiShips * 15;
      state.order.beforeTaxes += state.order.prePacks * 5;
      state.order.taxAmount = state.order.beforeTaxes * (state.order.taxes / 100);
      state.order.netValue = (state.order.beforeTaxes + state.order.taxAmount).toFixed(2);
      state.order.balanceOutstanding = (state.order.netValue - state.order.deposit - state.order.isrCollectedOrig - state.order.isrCollectedCAD - state.order.kitOrderPayment + state.order.isrRefunded).toFixed(2);
      if (state.order.balanceOutstanding > 0) {
        state.order.paymentStatus = "Balance Outstanding";
      } else if (state.order.balanceOutstanding < 0) {
        state.order.paymentStatus = "Refund Customer";
      } else if (state.order.balanceOutstanding == 0) {
        state.order.paymentStatus = "Complete";
      }
    },
    SET_ADD_ONS: (state, lineIndex) => {
      state.order.orderLines[lineIndex].totalAddOns = 0;
      const items = state.order.orderLines[lineIndex].items;
      for (let item of items) {
        if (!item.cancelled) {
          state.order.orderLines[lineIndex].totalAddOns += parseInt(item.addOns * item.totalUnits);
        }
      }
      state.order.orderLines[lineIndex].totalAddOns += state.order.orderLines[lineIndex].tracingCharge;
      state.order.orderLines[lineIndex].totalAddOns += state.order.orderLines[lineIndex].creativeCharge;
      state.order.orderLines[lineIndex].totalAddOns += state.order.orderLines[lineIndex].scaledArtCharge;
      state.order.orderLines[lineIndex].totalAddOns += state.order.orderLines[lineIndex].colourWashCharge;
    },
    SET_FINAL_UNIT_PRICE: (state, { lineIndex, itemIndex }) => {
      const item = state.order.orderLines[lineIndex].items[itemIndex];
      state.order.orderLines[lineIndex].items[itemIndex].finalUnitPrice = item.unitPrice - (item.unitPrice * (item.itemDiscount / 100));
      let qdDiscountAmount = 0;
      if (state.order.orderLines[lineIndex].graphicCode != 'CUSTM' && state.order.orderLines[lineIndex].graphicCode != null) {
        qdDiscountAmount = (item.totalUnits * item.finalUnitPrice) * .1;
      }
      state.order.orderLines[lineIndex].items[itemIndex].itemTotalPrice = (item.totalUnits * item.finalUnitPrice) - qdDiscountAmount;
    },
    SET_LINE_TOTAL: (state, lineIndex) => {
      const orderLine = state.order.orderLines[lineIndex];
      const items = orderLine.items;
      const totalAddOns = orderLine.totalAddOns;

      let itemsTotal = 0;
      let itemsQty = 0;
      for (let item of items) {
        if (!item.cancelled) {
          itemsTotal += item.itemTotalPrice;
          itemsQty += item.totalUnits;
        }
      }

      if (totalAddOns > 0) {
        itemsTotal += totalAddOns;
      }
      state.order.orderLines[lineIndex].lineItemsQty = itemsQty;
      state.order.orderLines[lineIndex].itemsSubTotal = itemsTotal.toFixed(2);
    },
    CANCEL_LINE: (state, lineIndex) => {

      const orderLine = state.order.orderLines[lineIndex];

      for (let item of orderLine.items) {
        item.cancelled = true;
      }
      orderLine.cancelled = true;
    },
    CANCEL_ITEM: (state, { lineIndex, itemIndex }) => {
      state.order.orderLines[lineIndex].items[itemIndex].cancelled = true;
    }
  },
  getters: {
    getColourWays: (state) => (index) => {
      return state.graphicCodes[index].colourWays;
    },
    totalBeforeAddOns: (state) => (lineIndex) => {
      const orderLine = state.order.orderLines[lineIndex];
      let totalBeforeAddOns = 0;
      for (let item of orderLine.items) {
        if (!item.cancelled) {
          totalBeforeAddOns += item.itemTotalPrice;
        }
      }
      return totalBeforeAddOns.toFixed(2);
    }
  }
});
