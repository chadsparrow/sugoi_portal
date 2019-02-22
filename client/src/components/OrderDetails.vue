<template>
  <div class="card border-dark">
    <div class="card-header bg-dark text-light p-2">
      <span>Order Details</span>
    </div>
    <div class="row card-body p-2">
      <div class="col-sm-3">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Order: {{order.orderNum}}</li>
          <li class="list-group-item">Custom Rep: {{order.isr}}</li>
          <li class="list-group-item">Order Date: {{formatDate(order.enteredDate)}}</li>
          <li
            class="list-group-item"
            v-if="order.eventDate"
          >Event Date: {{formatDate(order.eventDate)}}</li>
          <li
            class="list-group-item"
            v-if="order.eventDate"
          >In-Hand Date: {{formatDate(order.latestInHand)}}</li>
        </ul>
        <div class="d-print-none">
          <label for="orderNotes" class="mb-0 mt-2">Notes:</label>
          <textarea
            v-model="order.orderNotes"
            class="form-control"
            style="font-size: 12px; width: 100%; height: 80px; white-space: pre-wrap;"
            readonly
            id="orderNotes"
          ></textarea>
        </div>
      </div>
      <div class="col-sm-6 border-left">
        <div class="row m-0">
          <ul class="list-group list-group-flush col-sm-6">
            <li class="list-group-item">Account #: {{order.accountNum}}</li>
            <li class="list-group-item">Contact: {{order.contactName}}</li>
          </ul>
          <ul class="list-group list-group-flush col-sm-6">
            <li class="list-group-item">Client: {{order.client}}</li>
            <li class="list-group-item">Ship To Name: {{order.shipToName}}</li>
          </ul>
          <ul class="list-group list-group-flush col-sm-12">
            <li class="list-group-item">Ship To Address:
              <br>
              {{order.shipToAddress}}
            </li>
          </ul>
          <ul class="list-group list-group-flush col-sm-6">
            <li class="list-group-item">City: {{order.shipToCity}}</li>
            <li class="list-group-item">Country: {{order.shipToCountry}}</li>
            <li class="list-group-item">Phone: {{order.contactPhone}}</li>
          </ul>
          <ul class="list-group list-group-flush col-sm-6">
            <li class="list-group-item">State/Prov: {{order.shipToProvState}}</li>
            <li class="list-group-item">Zip/Postal: {{order.shipToPostalZip}}</li>
            <li class="list-group-item">Email: {{order.contactEmail}}</li>
          </ul>
          <ul class="list-group list-group-flush col-sm-12">
            <li class="list-group-item">Terms: {{order.approvedTerms}}</li>
            <li class="list-group-item">Signed Off Date: {{formatDate(order.signedOffDate)}}</li>
          </ul>
        </div>
      </div>
      <div class="col-sm-3 border-left text-center">
        <ul class="list-group list-group-flush">
          <li v-if="order.multiShips >0" class="list-group-item">MultiShips: {{order.multiShips}}</li>
          <li v-if="order.prePacks >0" class="list-group-item">PrePacks: {{order.prePacks}}</li>
          <li class="list-group-item">
            Currency:
            <span>{{order.currency}}</span>
          </li>
          <li v-if="order.taxes" class="list-group-item">
            Sub Total:
            <span>${{formatPrice(order.beforeTaxes)}}</span>
          </li>
          <li v-if="order.taxes" class="list-group-item" style="border-bottom:none;">
            Taxes: {{order.taxes}}% -
            <span>${{formatPrice(order.taxAmount)}}</span>
          </li>
        </ul>
        <div class="col-sm-12 mb-2 p-1 text-center border border-3 rounded">
          <span style="font-size: 18px; font-weight: bold;">Total:
            <br>
            ${{formatPrice(order.netValue)}}
          </span>
        </div>
        <ul class="list-group list-group-flush">
          <li v-if="order.deposit" class="list-group-item">Deposit: $ {{formatPrice(order.deposit)}}</li>
        </ul>
        <div class="mb-2 p-1 text-center border rounded">
          <h6>Balance Due:
            <br>
            ${{formatPrice(order.balanceOutstanding)}}
          </h6>
        </div>
        <div class="border-top pt-2">
          <button
            class="btn btn-success btn-block d-print-none"
            @click.prevent="goToEdit"
          >Edit Details</button>
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
    },
    goToEdit() {
      this.$router.push({ path: `/${this.order.orderNum}/editdetails` });
    },
    formatDate(date) {
      if (date) {
        return moment(date)
          .utc()
          .format("DD-MMM-YYYY");
      } else {
        return null;
      }
    }
  }
};
</script>

<style scoped>
span {
  font-weight: bold;
  font-size: 14px;
}

.card {
  font-size: 0.75em;
}

.textBlock {
  background-color: lightgrey;
  border-radius: 5px;
  padding: 2px 5px;
  margin-right: 2px;
}

.list-group-flush li:first-child {
  border-top: none;
}
</style>

