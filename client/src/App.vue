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
    this.$store.dispatch("getGraphicCodes");
    this.$store.dispatch("getReps");
    this.$store.dispatch("getProvincialTaxes");
    this.$store.dispatch("getUSAStates");
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
