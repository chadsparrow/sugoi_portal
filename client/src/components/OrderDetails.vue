<template>
  <div class="card border-dark">
    <div class="row card-body p-2">
      <div class="col-sm-3">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Order: {{order.orderNum}}</li>
          <li class="list-group-item">Custom Rep: {{order.isr}}</li>
          <li class="list-group-item">Order Date: {{formatDate(order.enteredDate)}}</li>
          <li class="list-group-item">Event Date: {{formatDate(order.eventDate)}}</li>
          <li class="list-group-item">In-Hand Date: {{formatDate(order.latestInHand)}}</li>
          <li class="list-group-item">Est. Ship Date: {{formatDate(order.estDeliveryDate)}}</li>
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
      <div class="col-sm-3 border-left">
        <ul class="list-group list-group-flush">
          <li v-if="order.multiShips >0" class="list-group-item">MultiShips: {{order.multiShips}}</li>
          <li v-if="order.prePacks >0" class="list-group-item">PrePacks: {{order.prePacks}}</li>
          <li class="list-group-item">Currency: {{order.currency}}</li>
          <li
            v-if="order.taxes"
            class="list-group-item"
            style="border-bottom:none;"
          >Taxes: {{order.taxes}} %</li>
        </ul>
        <div class="col-sm-12 mb-2 p-1 text-center border border-3 rounded">
          <h4>Total:
            <br>
            $ {{order.netValue}}
          </h4>
        </div>
        <ul class="list-group list-group-flush">
          <li v-if="order.deposit" class="list-group-item">Deposit: $ {{order.deposit}}</li>
        </ul>
        <div class="mb-2 p-1 text-center border rounded">
          <h6>Balance Due:
            <br>
            $ {{order.balanceOutstanding}}
          </h6>
        </div>
        <div class="border-top pt-2">
          <button
            class="btn btn-success btn-block d-print-none"
            @click.prevent="goToEdit()"
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
    goToEdit() {
      this.$router.push({ path: `/${this.order.orderNum}/editdetails` });
    },
    formatDate(date) {
      if (date) {
        return moment(date).format("DD-MMM-YYYY");
      } else {
        return null;
      }
    }
  }
};
</script>

<style scoped>
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

