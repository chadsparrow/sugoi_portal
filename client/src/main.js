import Vue from "vue"
import VueRouter from "vue-router"
import App from "./App.vue"
import { store } from "./store/store"

import Routes from './routes';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: Routes,
  mode: 'history'
});

router.beforeEach((to, from, next) => {
  if (store.getters.checkSignOff != null) {
    next();
  } else {
    next(false);
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
