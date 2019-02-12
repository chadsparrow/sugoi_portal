<template>
  <div class="card border-dark">
    <div class="row card-body p-2">
      <div class="col-sm-3">
        <div class="row m-0">
          <div class="col-sm-12 mb-2 p-2">Order: {{order.orderNum}}</div>
          <div class="col-sm-12 mb-2 p-2">Custom Rep: {{order.isr}}</div>
          <div class="col-sm-12 mb-2 p-2">Order Date: {{formatDate(order.enteredDate)}}</div>
          <div class="col-sm-12 mb-2 p-2">Event Date: {{formatDate(order.eventDate)}}</div>
          <div class="col-sm-12 mb-2 p-2">In-Hand Date: {{formatDate(order.latestInHand)}}</div>
          <div class="col-sm-12 mb-2 p-2">Est. Ship Date: {{formatDate(order.estDeliveryDate)}}</div>
          <div class="col-sm-12 mb-2 p-2">Notes:
            <br>
            {{order.orderNotes}}
          </div>
        </div>
      </div>
      <div class="col-sm-6 border-left">
        <div class="row m-0">
          <div class="col-sm-6 mb-2 p-2">Account #: {{order.accountNum}}</div>
          <div class="col-sm-6 mb-2 p-2">Client: {{order.client}}</div>
          <div class="col-sm-6 mb-2 p-2">Contact Name: {{order.contactName}}</div>
          <div class="col-sm-6 mb-2 p-2">Ship To Name: {{order.shipToName}}</div>
          <div class="col-sm-12 mb-2 p-2">Ship To Address:
            <br>
            {{order.shipToAddress}}
          </div>
          <div class="col-sm-6 mb-2 p-2">City: {{order.shipToCity}}</div>
          <div class="col-sm-6 mb-2 p-2">State/Prov: {{order.shipToProvState}}</div>
          <div class="col-sm-6 mb-2 p-2">Country: {{order.shipToCountry}}</div>
          <div class="col-sm-6 mb-2 p-2">Zip/Postal: {{order.shipToPostalZip}}</div>
          <div class="col-sm-6 mb-2 p-2">Phone: {{order.contactPhone}}</div>
          <div class="col-sm-6 mb-2 p-2">Email: {{order.contactEmail}}</div>
          <div class="col-sm-12 mb-2 p-2">Terms: {{order.approvedTerms}}</div>
          <div class="col-sm-12 mb-2 p-2">Signed Off Date: {{formatDate(order.signedOffDate)}}</div>
        </div>
      </div>
      <div class="col-sm-3 border-left">
        <div class="row m-0">
          <div
            v-if="order.multiShips > 0"
            class="col-sm-6 mb-2 p-2"
          >MultiShips: {{order.multiShips}}</div>
          <div v-if="order.prePacks > 0" class="col-sm-6 mb-2 p-2">PrePacks: {{order.prePacks}}</div>
          <div class="col-sm-12 mb-2 p-2">Currency: {{order.currency}}</div>
          <div v-if="order.taxes" class="col-sm-12 mb-2 p-2">Taxes: {{order.taxes}}%</div>
          <div class="col-sm-12 mb-2 p-2 text-center bg-secondary text-light rounded">
            <h3>Total:
              <br>
              ${{order.netValue}}
            </h3>
          </div>
          <div v-if="order.deposit" class="col-sm-12 mb-2 p-2">Deposit: {{order.deposit}}%</div>
          <div class="col-sm-12 mb-2 p-2 text-center bg-secondary text-light rounded">
            <h5>Balance Due:
              <br>
              ${{order.balanceOutstanding}}
            </h5>
          </div>
          <div class="col-sm-12 border-top pt-2">
            <button
              class="btn btn-success btn-block d-print-none"
              @click.prevent="goToEdit()"
            >Edit Details</button>
          </div>
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
</style>

