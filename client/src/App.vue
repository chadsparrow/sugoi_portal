<template>
	<div id="app" class="container">
		<loading :active.sync="isLoading" :is-full-page="fullPage"></loading>
		<Header />
		<router-view></router-view>
	</div>
</template>

<script>
import Header from './components/Header.vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
	name: 'App',
	data() {
		return {
			orderNum: this.$route.params.orderNum,
			isLoading: false,
			fullPage: true
		};
	},
	created() {
		this.isLoading = true;
		this.$store.dispatch('getOrderData', this.orderNum);
		this.$store.dispatch('getStyles');
		this.$store.dispatch('getSGPrices2019');
		this.$store.dispatch('getSGPrices2020');
		this.$store.dispatch('getLGStyles');
		this.$store.dispatch('getLGPrices2019');
		this.$store.dispatch('getLGPrices2020');
		this.$store.dispatch('getGraphicCodes');
		this.$store.dispatch('getReps');
		this.$store.dispatch('getProvincialTaxes');
		this.$store.dispatch('getUSAStates');
		this.$store.dispatch('getSwatches');
		this.isLoading = false;
	},
	components: {
		Header,
		Loading
	}
};
</script>

<style>
img {
	height: 65px;
}
</style>
