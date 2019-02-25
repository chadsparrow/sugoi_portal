import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VueAxios from "vue-axios";
import { getField, updateField } from 'vuex-map-fields';

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
    saveOrder: ({ commit }, order) => {
      let orderLines = order.orderLines;
      let linesTotal = 0;
      for (let x = 0; x < orderLines.length; x++) {
        let currentLine = orderLines[x];
        if (!currentLine.cancelled) {
          linesTotal += currentLine.itemsSubTotal;
        }
      }
      order.beforeTaxes = linesTotal;
      order.taxAmount = linesTotal * (order.taxes / 100);
      order.netValue = linesTotal + order.taxAmount + (order.prePacks * 5) + (order.multiShips * 15);

      order.balanceOutstanding = order.netValue - order.deposit - order.isrCollectedOrig + order.isrRefunded;

      axios
        .put(`https://localhost:5000/api/orders/${order.orderNum}`, order)
        .then(r => r.data)
        .then(order => {
          commit("SAVE_ORDER_DATA", order);
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
        .get(`https://localhost:5000/api/styles`)
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
    setCountryUpper: ({ commit }, text) => {
      text = text.toUpperCase();
      commit('SET_COUNTRY_UPPER', text);
      commit('RESET_STATE_PROV');
      commit('SET_CURRENCY', text);
    },
    setItemTotalUnits: ({ commit }, { lineIndex, itemIndex }) => {
      commit('SET_ITEM_TOTAL_UNITS', { lineIndex, itemIndex });
    },
    getItemUnitPrice: ({ commit, dispatch, getters }, { lineIndex, itemIndex }) => {
      commit('GET_ITEM_UNIT_PRICE', { lineIndex, itemIndex, getters });
    },
    setItemAddOns: ({ commit }) => {

    },
    setItemFinalUnitPrice: ({ commit }) => {

    },
    setItemTotalPrice: ({ commit }) => {

    },
    setLineSubTotal: ({ commit }) => {

    },
    setOrderSubTotal: ({ commit }) => {

    },
    setTaxAmount: ({ commit }, tax) => {

    },
    setOrderNetValue: ({ commit }) => {

    },
    setOrderBalanceOutstanding: ({ commit }) => {

    },
    setSelectedStyle: ({ commit }, { lineIndex, itemIndex }) => {
      commit('SET_SELECTED_STYLE', { lineIndex, itemIndex });
    },
    setSelectedConfig: ({ commit, dispatch }, { lineIndex, itemIndex }) => {
      commit('SET_SELECTED_CONFIG', { lineIndex, itemIndex });
      dispatch('getItemUnitPrice', { lineIndex, itemIndex });
    }
  },
  mutations: {
    updateField,
    SET_ORDER_DATA: (state, order) => {
      state.order = order;
    },
    SAVE_ORDER_DATA: (state, order) => {
      state.order = order;
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
      const { one, xxs, xs, s, m, l, xl, xxl, xxxl } = state.order.orderLines[lineIndex].items[itemIndex];
      state.order.orderLines[lineIndex].items[itemIndex].totalUnits = one + xxs + xs + s + m + l + xl + xxl + xxxl;
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

      if (item.extendedDescription.includes("ZAP")) {
        item.zap = true;
      } else {
        item.zap = false;
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
    GET_ITEM_UNIT_PRICE: (state, { lineIndex, itemIndex, getters }) => {

      const item = state.order.orderLines[lineIndex].items[itemIndex];
      const { selectedStyle, selectedConfig } = item;
      const currency = state.order.currency;
      const priceBreak = getters.getPriceBreak(lineIndex);
      const currentConfig = state.styles[selectedStyle].configurations[selectedConfig];

      if (currency === "CAD" && selectedConfig > -1) {
        if (priceBreak === 1) {
          item.unitPrice = currentConfig.cad1;
        } else if (priceBreak === 6) {
          item.unitPrice = currentConfig.cad6;
        } else if (priceBreak === 12) {
          item.unitPrice = currentConfig.cad12;
        } else if (priceBreak === 24) {
          item.unitPrice = currentConfig.cad24;
        } else if (priceBreak === 50) {
          item.unitPrice = currentConfig.cad50;
        } else if (priceBreak === 100) {
          item.unitPrice = currentConfig.cad100;
        } else if (priceBreak === 200) {
          item.unitPrice = currentConfig.cad200;
        } else if (priceBreak === 500) {
          item.unitPrice = currentConfig.cad500;
        }
      } else if (currency === "USD" && selectedConfig > -1) {
        if (priceBreak === 1) {
          item.unitPrice = currentConfig.usd1;
        } else if (priceBreak === 6) {
          item.unitPrice = currentConfig.usd6;
        } else if (priceBreak === 12) {
          item.unitPrice = currentConfig.usd12;
        } else if (priceBreak === 24) {
          item.unitPrice = currentConfig.usd24;
        } else if (priceBreak === 50) {
          item.unitPrice = currentConfig.usd50;
        } else if (priceBreak === 100) {
          item.unitPrice = currentConfig.usd100;
        } else if (priceBreak === 200) {
          item.unitPrice = currentConfig.usd200;
        } else if (priceBreak === 500) {
          item.unitPrice = currentConfig.usd500;
        }
      }
    }
  },
  getters: {
    getField,
    getColourWays: (state) => (index) => {
      return state.graphicCodes[index].colourWays;
    },
    getPriceBreak: (state) => (lineIndex) => {
      return state.order.orderLines[lineIndex].priceBreak;
    }
  }
});
