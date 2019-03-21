<template>
  <div class="row mb-5">
    <div class="card border-dark col-sm-3 offset-sm-9">
      <div class="row card-body p-2 text-center">
        <ul class="list-group list-group-flush col-sm-12">
          <li class="list-group-item">
            Currency:
            <span>{{order.currency}}</span>
          </li>
          <li v-if="order.multiShips >0" class="list-group-item">
            MultiShips:
            <span>{{order.multiShips}} @ $15 = ${{formatPrice(order.multiShips * 15)}}</span>
          </li>
          <li v-if="order.prePacks >0" class="list-group-item">
            PrePacks:
            <span>{{order.prePacks}} @ $5 = ${{formatPrice(order.prePacks * 5)}}</span>
          </li>
          <li v-if="order.revisionCharge >0" class="list-group-item">
            Extra Revisions:
            <span>${{formatPrice(order.revisionCharge)}}</span>
          </li>
          <li v-if="order.taxes" class="list-group-item">
            Sub Total:
            <span>${{formatPrice(order.beforeTaxes)}}</span>
          </li>
          <li v-if="order.taxes" class="list-group-item" style="border-bottom:none;">
            Taxes: {{order.taxes}}% |
            <span>${{formatPrice(order.taxAmount)}}</span>
          </li>
        </ul>
        <div class="col-sm-12 mb-2 p-1 border border-3 rounded">
          <span style="font-size: 18px; font-weight: bold;">
            Total:
            <br>
            ${{formatPrice(order.netValue)}}
          </span>
        </div>
        <ul class="list-group list-group-flush col-sm-12">
          <li v-if="order.deposit" class="list-group-item">Deposit: $ {{formatPrice(order.deposit)}}</li>
        </ul>
        <div class="mb-2 p-1 border rounded col-sm-12">
          <h6>
            Balance Due:
            <br>
            ${{formatPrice(order.balanceOutstanding)}}
          </h6>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "OrderDetails",
  computed: {
    order() {
      return this.$store.state.order;
    }
  },
  methods: {
    formatPrice(value) {
      let val = (value / 1).toFixed(2);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
};
</script>

<style scoped>
span {
  font-weight: bold;
  font-size: 14px;
  text-transform: capitalize;
}

.card {
  font-size: 0.75em;
  page-break-inside: avoid;
}

.list-group-flush li:first-child {
  border-top: none;
}
</style>

