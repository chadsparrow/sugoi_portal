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
    saveOrder: ({ commit, dispatch }, order) => {
      let orderLines = order.orderLines;
      let linesTotal = 0;
      for (let x = 0; x < orderLines.length; x++) {
        let currentLine = orderLines[x];
        if (!currentLine.cancelled) {
          linesTotal += currentLine.itemsSubTotal;
        }
      }
      order.netValue = linesTotal + (linesTotal * (order.taxes / 100)) + (order.prePacks * 5) + (order.multiShips * 15);

      order.balanceOutstanding = order.netValue - order.deposit - order.isrCollectedOrig + order.isrRefunded;

      axios
        .put(`https://localhost:5000/api/orders/${order.orderNum}`, order)
        .then(r => r.data)
        .then(order => {
          commit("SAVE_ORDER_DATA", order);
          dispatch("getOrderData", order.orderNum);
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
        state.order.taxes = null;
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
    }
  },
  getters: {
    getField,
    getColourWays: (state) => (index) => {
      return state.graphicCodes[index].colourWays;
    }
  }
});
