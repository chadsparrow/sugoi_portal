<template>
  <div id="app" class="container">
    <Header/>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from "./components/Header.vue";

export default {
  name: "App",
  data() {
    return {
      orderNum: this.$route.params.orderNum
    };
  },
  created() {
    this.$store.dispatch("getOrderData", this.orderNum);
    this.$store.dispatch("getStyles");
  },
  updated() {
    console.log("App updated");
    this.$store.dispatch("getOrderData", this.orderNum);
  },
  components: {
    Header
  }
};
</script>

<style>
img {
  height: 65px;
}
</style>
