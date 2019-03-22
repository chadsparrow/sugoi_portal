<template>
  <div class="card border-dark">
    <div class="card-header bg-dark text-light p-2">
      <span>Order Details</span>
      <div class="badge badge-info text-white text-center ml-3 d-print-none" v-if="order.need3d">3D</div>
      <div
        class="badge badge-danger text-white text-center ml-3 d-print-none"
        v-if="order.needSketch"
      >Flat Sketch</div>
    </div>
    <div class="row card-body p-2">
      <div class="col-sm-3">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            Order:
            <span>{{order.orderNum}}</span>
          </li>
          <li class="list-group-item">
            Custom Rep:
            <span>{{order.isr}}</span>
          </li>
          <li class="list-group-item">
            Order Date:
            <span>{{formatDate(order.enteredDate)}}</span>
          </li>
          <li class="list-group-item" v-if="order.eventDate">
            Event Date:
            <span>{{formatDate(order.eventDate)}}</span>
          </li>
          <li class="list-group-item" v-if="order.eventDate">
            In-Hand Date:
            <span>{{formatDate(order.latestInHand)}}</span>
          </li>
          <li class="list-group-item">
            <label for="customerPO">Customer PO:</label>
            <input
              type="text"
              class="form-control form-control-sm"
              id="customerPO"
              v-model.trim.lazy="order.customerPO"
              @change="saveNotes"
            >
          </li>
        </ul>
        <div class="d-print-none text-center">
          <label for="orderNotes" class="mb-0 mt-2">Notes:</label>
          <textarea
            v-model.lazy="order.orderNotes"
            class="form-control"
            style="font-size: 12px; width: 100%; height: 125px; white-space: pre-wrap;"
            id="orderNotes"
            @change="saveNotes"
          ></textarea>
        </div>
      </div>
      <div class="col-sm-6 border-left">
        <div class="row m-0">
          <ul class="list-group list-group-flush col-sm-6">
            <li class="list-group-item">
              Account #:
              <span>{{order.accountNum}}</span>
            </li>
            <li class="list-group-item">
              Contact:
              <span>{{order.contactName}}</span>
            </li>
          </ul>
          <ul class="list-group list-group-flush col-sm-6">
            <li class="list-group-item">
              Client:
              <span>{{order.client}}</span>
            </li>
            <li class="list-group-item">
              Ship To Name:
              <span>{{order.shipToName}}</span>
            </li>
          </ul>
          <ul class="list-group list-group-flush col-sm-12">
            <li class="list-group-item">
              Ship To Address:
              <br>
              <span>{{order.shipToAddress}}</span>
            </li>
          </ul>
          <ul class="list-group list-group-flush col-sm-6">
            <li class="list-group-item">
              City:
              <span>{{order.shipToCity}}</span>
            </li>
            <li class="list-group-item">
              Country:
              <span>{{order.shipToCountry}}</span>
            </li>
            <li class="list-group-item">
              Phone:
              <span>{{order.contactPhone}}</span>
            </li>
          </ul>
          <ul class="list-group list-group-flush col-sm-6">
            <li class="list-group-item">
              State/Prov:
              <span>{{order.shipToProvState}}</span>
            </li>
            <li class="list-group-item">
              Zip/Postal:
              <span class="postal">{{order.shipToPostalZip}}</span>
            </li>
            <li class="list-group-item">
              Email:
              <span style="text-transform: none;">{{order.contactEmail}}</span>
            </li>
          </ul>
          <ul class="list-group list-group-flush col-sm-12">
            <li class="list-group-item">
              Terms:
              <span>{{order.approvedTerms}}</span>
            </li>
            <li class="list-group-item">
              Signed Off Date:
              <span>{{formatDate(order.signedOffDate)}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-sm-3 border-left text-center">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            Currency:
            <span>{{order.currency}}</span>
          </li>
          <!-- <li v-if="order.multiShips > 0 || order.prePacks>0" class="list-group-item">
            Before Multi/Prepacks:
            <span>${{formatPrice(beforeAddOns)}}</span>
          </li>-->
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
        <div class="col-sm-12 mb-2 p-1 text-center border border-3 rounded">
          <span style="font-size: 18px; font-weight: bold;">
            Total:
            <br>
            ${{formatPrice(order.netValue)}}
          </span>
        </div>
        <ul class="list-group list-group-flush">
          <li v-if="order.deposit" class="list-group-item">Deposit: $ {{formatPrice(order.deposit)}}</li>
        </ul>
        <div class="mb-2 p-1 text-center border rounded">
          <h6>
            Balance Due:
            <br>
            ${{formatPrice(order.balanceOutstanding)}}
          </h6>
        </div>
        <div class="border-top pt-2">
          <router-link
            tag="button"
            :to="`/${this.order.orderNum}/editdetails`"
            class="btn btn-success btn-block d-print-none"
          >Edit Details</router-link>
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
    formatDate(date) {
      if (date) {
        return moment(date)
          .utc()
          .format("DD-MMM-YYYY");
      } else {
        return null;
      }
    },
    saveNotes() {
      this.$store.dispatch("saveOrder");
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

span.postal {
  text-transform: uppercase;
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

