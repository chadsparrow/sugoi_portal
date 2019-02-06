<template>
  <div class="card bg-light">
    <form>
      <div class="row card-body">
        <div class="col-sm-3">
          <div class="form-group mb-1">
            <label for="orderNum" class="small">Order #</label>
            <input
              type="text"
              class="form-control form-control-sm"
              id="orderNum"
              v-model.trim="orderNum"
              readonly
            >
          </div>
          <div class="form-group mb-1">
            <label for="isr" class="small">Custom Rep</label>
            <select class="form-control form-control-sm" id="isr" v-model="isr">
              <option v-for="(rep, index) in reps" :value="rep.value" :key="index">{{rep.text}}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="requestDate" class="small">Order Date</label>
            <DatePicker
              v-model="enteredDate"
              id="requestDate"
              :disabled="true"
              :bootstrapStyling="true"
              :use-utc="true"
              input-class="form-control form-control-sm"
            ></DatePicker>
          </div>
          <hr>
          <div class="form-group mb-1">
            <label for="eventDate" class="small">Event Date</label>
            <DatePicker
              v-model="eventDate"
              :bootstrapStyling="true"
              :use-utc="true"
              :clearButton="true"
              input-class="form-control form-control-sm"
              id="eventDate"
            ></DatePicker>
          </div>
          <div class="form-group mb-1">
            <label for="latestInHand" class="small">In-Hand Date</label>
            <DatePicker
              v-model="latestInHand"
              :bootstrapStyling="true"
              :use-utc="true"
              :clearButton="true"
              input-class="form-control form-control-sm"
              id="latestInHand"
            ></DatePicker>
          </div>
          <div class="form-group mb-1">
            <label for="estShipDate" class="small">Est. Ship Date</label>
            <DatePicker
              v-model="estShipDate"
              :bootstrapStyling="true"
              :use-utc="true"
              :clearButton="true"
              input-class="form-control form-control-sm"
              id="estShipDate"
            ></DatePicker>
          </div>
          <div class="form-group">
            <label for="orderNotes" class="small">Notes</label>
            <textarea
              class="form-control form-control-sm"
              rows="3"
              id="orderNotes"
              v-model.trim="orderNotes"
            ></textarea>
          </div>
        </div>
        <div class="col-sm-7 border-left border-right">
          <div class="row">
            <div class="form-group mb-1 col-sm-6">
              <label for="accountNum" class="small">Account #</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="accountNum"
                v-model.trim="accountNum"
              >
            </div>
            <div class="form-group mb-1 col-sm-6">
              <label for="client" class="small">Client</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="client"
                v-model.trim="client"
              >
            </div>
            <div class="form-group mb-1 col-sm-6">
              <label for="contactName" class="small">Contact Name</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="contactName"
                v-model.trim="contactName"
              >
            </div>
            <div class="form-group mb-1 col-sm-6">
              <label for="shipToName" class="small">Ship To Name</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="shipToName"
                v-model.trim="shipToName"
              >
            </div>
            <div class="form-group mb-1 col-sm-12">
              <label for="shipToAddress" class="small">Ship To Address</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="shipToAddress"
                v-model.trim="shipToAddress"
              >
            </div>
            <div class="form-group mb-1 col-sm-6">
              <label for="shipToCity" class="small">City</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="shipToCity"
                v-model.trim="shipToCity"
              >
            </div>
            <div
              class="form-group mb-1 col-sm-6"
              v-if="shipToCountry === 'CA'|| shipToCountry ==='CANADA' || shipToCountry ==='CAN'"
            >
              <label for="shipToProvState" class="small">Province</label>
              <select
                class="form-control form-control-sm"
                id="shipToProvState"
                v-model="shipToProvState"
                @change="setProvTax"
              >
                <option
                  v-for="(prov, index) in provs"
                  :value="prov.abbrev"
                  :key="index"
                >{{prov.abbrev}} - {{prov.province}}</option>
              </select>
            </div>
            <div
              class="form-group mb-1 col-sm-6"
              v-else-if="shipToCountry ==='USA'|| shipToCountry==='US' || shipToCountry==='UNITED STATES'"
            >
              <label for="shipToProvState" class="small">State</label>
              <select
                class="form-control form-control-sm"
                id="shipToProvState"
                v-model="shipToProvState"
                @change="setTaxOther(null)"
              >
                <option
                  v-for="(state, index) in states"
                  :value="state.abbrev"
                  :key="index"
                >{{state.abbrev}} - {{state.state}}</option>
              </select>
            </div>
            <div class="form-group mb-1 col-sm-6" v-else>
              <label for="shipToProvState" class="small">State/Prov</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="shipToProvState"
                v-model.trim="shipToProvState"
                @change="setTaxOther(null)"
              >
            </div>

            <div class="form-group mb-1 col-sm-6">
              <label for="shipToCountry" class="small">Country</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="shipToCountry"
                v-model.trim.lazy="shipToCountry"
                @change="setCountryUpper"
              >
            </div>

            <div class="form-group mb-1 col-sm-6">
              <label for="shipToPostalZip" class="small">Zip/Postal</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="shipToPostalZip"
                v-model.trim="shipToPostalZip"
              >
            </div>
            <div class="form-group mb-1 col-sm-6">
              <label for="contactPhone" class="small">Phone</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="contactPhone"
                v-model.trim="contactPhone"
              >
            </div>
            <div class="form-group mb-1 col-sm-6">
              <label for="contactEmail" class="small">Email</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="contactEmail"
                v-model.trim="contactEmail"
              >
            </div>
            <div class="form-group col-sm-12 mb-1">
              <label for="approvedTerms" class="small">Terms</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="approvedTerms"
                v-model.trim="approvedTerms"
              >
            </div>
            <div class="form-group col-sm-12">
              <label for="signedOffDate" class="small">Signed-Off Date</label>
              <DatePicker
                v-model="signedOffDate"
                :bootstrapStyling="true"
                :use-utc="true"
                input-class="form-control form-control-sm"
                :disabled="true"
              ></DatePicker>
            </div>
          </div>
        </div>
        <div class="col-sm-2">
          <div class="form-group mb-1" v-if="prePacks === 0 || prePacks === null">
            <label for="multiShips" class="small">Multi-Ships</label>
            <input
              type="number"
              class="form-control form-control-sm"
              id="multiShips"
              min="0"
              v-model.number="multiShips"
            >
          </div>
          <div class="form-group mb-1" v-if="multiShips === 0 || multiShips === null">
            <label for="prePacks" class="small">Pre-Packs</label>
            <input
              type="number"
              class="form-control form-control-sm"
              id="prePacks"
              min="0"
              v-model.number="prePacks"
            >
          </div>
          <hr>
          <div class="form-group mb-2">
            <label for="currency" class="small">Currency</label>
            <select class="form-control form-control-sm" id="currency" v-model="currency" disabled>
              <option value="CAD">CAD</option>
              <option value="USD">USD</option>
            </select>
          </div>

          <div class="input-group input-group-sm mb-2">
            <input
              type="number"
              class="form-control text-center"
              id="taxes"
              min="0"
              placeholder="Taxes"
              v-model.number="taxes"
            >
            <div class="input-group-append">
              <span class="input-group-text">% Tax</span>
            </div>
          </div>

          <h3 class="text-center bg-secondary text-light rounded p-1 mb-0">Total:
            <h4>${{netValue}}</h4>
          </h3>
          <small>Deposit</small>
          <div class="input-group input-group-sm mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">$</span>
            </div>
            <input
              type="number"
              class="form-control text-center"
              id="deposit"
              min="0"
              v-model.number="deposit"
            >
          </div>
          <p class="text-center bg-secondary text-light rounded">Balance Due:
            <br>
            <span>${{balanceOutstanding}}</span>
          </p>
          <button class="btn btn-success d-print-none" @click.prevent>Submit
            <br>Changes
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import DatePicker from "vuejs-datepicker";
import { mapFields } from "vuex-map-fields";

export default {
  name: "OrderDetails",
  components: {
    DatePicker
  },
  computed: {
    ...mapFields([
      "order.orderNum",
      "order.isr",
      "order.enteredDate",
      "order.eventDate",
      "order.latestInHand",
      "order.estShipDate",
      "order.orderNotes",
      "order.accountNum",
      "order.client",
      "order.contactName",
      "order.shipToName",
      "order.shipToAddress",
      "order.shipToCity",
      "order.shipToProvState",
      "order.shipToCountry",
      "order.shipToPostalZip",
      "order.contactPhone",
      "order.contactEmail",
      "order.approvedTerms",
      "order.signedOffDate",
      "order.multiShips",
      "order.prePacks",
      "order.currency",
      "order.taxes",
      "order.netValue",
      "order.deposit",
      "order.balanceOutstanding"
    ]),
    reps() {
      return this.$store.state.reps;
    },
    provs() {
      return this.$store.state.provs;
    },
    states() {
      return this.$store.state.states;
    }
  },
  methods: {
    setProvTax(e) {
      let index = e.target.selectedIndex;
      let tax = this.provs[index].tax;
      this.$store.dispatch("setProvTax", tax);
    },
    setTaxOther(tax) {
      this.$store.dispatch("setProvTax", tax);
    },
    setCountryUpper(e) {
      let text = e.target.value;
      text = text.toUpperCase();
      this.$store.dispatch("setCountryUpper", text);
    }
  }
};
</script>

<style scoped>
button {
  width: 100%;
  height: 80px;
}
</style>
