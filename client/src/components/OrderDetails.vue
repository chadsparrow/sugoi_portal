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
              v-model.trim="order.orderNum"
              readonly
            >
          </div>
          <div class="form-group mb-1">
            <label for="isr" class="small">Custom Rep</label>
            <select class="form-control form-control-sm" id="isr" v-model="order.isr">
              <option v-for="(rep, index) in reps" :value="rep.value" :key="index">{{rep.text}}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="requestDate" class="small">Order Date</label>
            <date-picker
              v-model="order.enteredDate"
              input-class="form-control form-control-sm"
              id="requestDate"
            ></date-picker>
          </div>
          <hr>
          <div class="form-group mb-1">
            <label for="eventDate" class="small">Event Date</label>
            <date-picker
              v-model="order.eventDate"
              input-class="form-control form-control-sm"
              id="eventDate"
            ></date-picker>
          </div>
          <div class="form-group mb-1">
            <label for="latestInHand" class="small">In-Hand Date</label>
            <date-picker
              v-model="order.latestInHand"
              input-class="form-control form-control-sm"
              id="latestInHand"
            ></date-picker>
          </div>
          <div class="form-group mb-1">
            <label for="estShipDate" class="small">Est. Ship Date</label>
            <date-picker
              v-model="order.estShipDate"
              input-class="form-control form-control-sm"
              id="estShipDate"
            ></date-picker>
          </div>
          <div class="form-group">
            <label for="orderNotes" class="small">Notes</label>
            <textarea
              class="form-control form-control-sm"
              rows="3"
              id="orderNotes"
              v-model.trim="order.orderNotes"
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
                v-model.trim="order.accountNum"
              >
            </div>
            <div class="form-group mb-1 col-sm-6">
              <label for="client" class="small">Account Name</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="client"
                v-model.trim="order.client"
              >
            </div>
            <div class="form-group mb-1 col-sm-6">
              <label for="contactName" class="small">Contact Name</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="contactName"
                v-model.trim="order.contactName"
              >
            </div>
            <div class="form-group mb-1 col-sm-6">
              <label for="shipToName" class="small">Ship To Name</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="shipToName"
                v-model.trim="order.shipToName"
              >
            </div>
            <div class="form-group mb-1 col-sm-12">
              <label for="shipToAddress" class="small">Ship To Address</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="shipToAddress"
                v-model.trim="order.shipToAddress"
              >
            </div>
            <div class="form-group mb-1 col-sm-6">
              <label for="shipToCity" class="small">City</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="shipToCity"
                v-model.trim="order.shipToCity"
              >
            </div>
            <div
              class="form-group mb-1 col-sm-6"
              v-if="order.shipToCountry === 'CA'|| order.shipToCountry ==='Canada' || order.shipToCountry ==='CAN' || order.shipToCountry==='Can'"
            >
              <label for="shipToProvState" class="small">Province</label>
              <select
                class="form-control form-control-sm"
                id="shipToProvState"
                v-model="order.shipToProvState"
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
              v-else-if="order.shipToCountry ==='USA'|| order.shipToCountry==='US' || order.shipToCountry==='United States'"
            >
              <label for="shipToProvState" class="small">State</label>
              <select
                class="form-control form-control-sm"
                id="shipToProvState"
                v-model="order.shipToProvState"
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
                v-model.trim="order.shipToProvState"
                @change="setTaxOther(null)"
              >
            </div>

            <div class="form-group mb-1 col-sm-6">
              <label for="shipToCountry" class="small">Country</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="shipToCountry"
                v-model.trim="order.shipToCountry"
              >
            </div>
            <div class="form-group mb-1 col-sm-6">
              <label for="shipToPostalZip" class="small">Zip/Postal</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="shipToPostalZip"
                v-model.trim="order.shipToPostalZip"
              >
            </div>
            <div class="form-group mb-1 col-sm-6">
              <label for="contactPhone" class="small">Phone</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="contactPhone"
                v-model.trim="order.contactPhone"
              >
            </div>
            <div class="form-group mb-1 col-sm-6">
              <label for="contactEmail" class="small">Email</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="contactEmail"
                v-model.trim="order.contactEmail"
              >
            </div>
            <div class="form-group col-sm-12 mb-1">
              <label for="approvedTerms" class="small">Terms</label>
              <input
                type="text"
                class="form-control form-control-sm"
                id="approvedTerms"
                v-model.trim="order.approvedTerms"
              >
            </div>
            <div class="form-group col-sm-12">
              <label for="signedOffDate" class="small">Signed-Off Date</label>
              <date-picker v-model="order.signedOffDate" input-class="form-control form-control-sm"></date-picker>
            </div>
          </div>
        </div>
        <div class="col-sm-2">
          <div class="form-group mb-1" v-if="order.prePacks === 0 || order.prePacks === null">
            <label for="multiShips" class="small">Multi-Ships</label>
            <input
              type="number"
              class="form-control form-control-sm"
              id="multiShips"
              min="0"
              v-model.number="order.multiShips"
            >
          </div>
          <div class="form-group mb-1" v-if="order.multiShips === 0 || order.multiShips === null">
            <label for="prePacks" class="small">Pre-Packs</label>
            <input
              type="number"
              class="form-control form-control-sm"
              id="prePacks"
              min="0"
              v-model.number="order.prePacks"
            >
          </div>
          <hr>
          <div class="input-group input-group-sm mb-1">
            <input
              type="number"
              class="form-control"
              id="orderDiscount"
              min="0"
              v-model.number="order.orderDiscount"
            >
            <div class="input-group-append">
              <span class="input-group-text">% Discount</span>
            </div>
          </div>

          <div class="form-group mb-2">
            <label for="currency" class="small">Currency</label>
            <select class="form-control form-control-sm" id="currency" v-model="order.currency">
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
              v-model.number="order.taxes"
            >
            <div class="input-group-append">
              <span class="input-group-text">% Tax</span>
            </div>
          </div>

          <h3 class="text-center bg-dark text-light rounded p-1 mb-2">Total: ${{order.netValue}}</h3>
          <div class="input-group input-group-sm mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">$</span>
            </div>
            <input
              type="number"
              class="form-control"
              id="deposit"
              min="0"
              placeholder="Deposit"
              v-model.number="order.deposit"
            >
          </div>
          <p class="text-center bg-dark text-light rounded">Balance Due:
            <br>
            ${{order.balanceOutstanding}}
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

export default {
  components: {
    DatePicker
  },
  computed: {
    order() {
      return this.$store.state.order;
    },
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
    }
  },
  name: "OrderDetails"
};
</script>

<style scoped>
button {
  width: 100%;
  height: 80px;
}
</style>
