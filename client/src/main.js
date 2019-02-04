import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import { store } from "./store/store";

Vue.use(VueRouter);

new Vue({
  store: store,
  render: h => h(App)
}).$mount("#app");
