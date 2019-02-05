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
    states: []
  },
  actions: {
    getOrderData: ({ commit }, orderNum) => {
      axios
        .get(`https://localhost:5000/api/orders/${orderNum}`)
        .then(r => r.data[0])
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
    setProvTax: ({ commit }, tax) => {
      commit('SET_PROV_TAX', tax);
    },
    setCurrency: ({ commit }, country) => {
      commit('SET_CURRENCY', country)
    }
  },
  mutations: {
    SET_ORDER_DATA: (state, order) => {
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
    SET_PROV_TAX: (state, tax) => {
      if (tax > 0) {
        state.order.taxes = tax;
      } else {
        state.order.taxes = null;
      }
    },
    SET_CURRENCY: (state, country, getters) => {
      country = country.toUpperCase();
      if (country === 'CA' || country === 'CAN' || country === 'CANADA') {
        state.order.country = country.toUpperCase();
        state.order.currency = "CAD"
      } else if (country === 'US' || country === 'USA' || country === 'UNITED STATES' || country === "UNITED STATES OF AMERICA") {
        state.order.country = country.toUpperCase();
        state.order.currency = "USD"
      } else if (country === '') {
        state.order.country = country.toUpperCase();
        state.order.currency = null;
      } else if (country === null) {
        state.order.currency = null;
      }
    }
  },
  getters: {}
});
