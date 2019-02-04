import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(Vuex);
Vue.use(VueAxios, axios);

export const store = new Vuex.Store({
  state: {
    order: {}
  },
  actions: {
    getOrderData: ({ commit }, orderNum) => {
      axios
        .get(`https://localhost:5000/api/orders/${orderNum}`)
        .then(r => r.data[0])
        .then(order => {
          commit("SET_ORDER_DATA", order);
        });
    }
  },
  mutations: {
    SET_ORDER_DATA: (state, order) => {
      state.order = order;
    }
  },
  getters: {}
});
