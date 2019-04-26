<template>
  <div class="card border-dark">
    <div class="card-header bg-dark text-light p-2">Contract#: {{order.orderNum}}</div>
    <div class="row card-body p-2">
      <div class="col-sm-3">
        <div class="form-group mb-1">
          <label for="isr" class="small my-0">Custom Rep</label>
          <select class="form-control form-control-sm" id="isr" v-model="order.isr">
            <option v-for="(rep, index) in reps" :value="rep.value" :key="index">{{rep.text}}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="requestDate" class="small my-0">Order Date</label>
          <DatePicker
            v-model="order.enteredDate"
            id="requestDate"
            :disabled="true"
            :bootstrapStyling="true"
            input-class="form-control form-control-sm"
          ></DatePicker>
        </div>
        <div class="form-group mb-1">
          <label for="eventDate" class="small my-0">Event Date</label>
          <DatePicker
            v-model="order.eventDate"
            :bootstrapStyling="true"
            :clearButton="true"
            input-class="form-control form-control-sm"
            id="eventDate"
          ></DatePicker>
        </div>
        <div class="form-group mb-1">
          <label for="latestInHand" class="small my-0">In-Hand Date</label>
          <DatePicker
            v-model="order.latestInHand"
            :bootstrapStyling="true"
            :clearButton="true"
            input-class="form-control form-control-sm"
            id="latestInHand"
          ></DatePicker>
        </div>
        <div class="form-group mb-1">
          <label for="estShipDate" class="small my-0">Est. Ship Date</label>
          <DatePicker
            v-model="order.estDeliveryDate"
            :bootstrapStyling="true"
            :clearButton="true"
            input-class="form-control form-control-sm"
            id="estShipDate"
          ></DatePicker>
        </div>
        <div class="form-group mb-1">
          <label for="customerPO">Customer PO:</label>
          <input
            type="text"
            class="form-control form-control-sm"
            id="customerPO"
            v-model.trim="order.customerPO"
          >
        </div>
        <div class="form-group">
          <label for="orderNotes" class="small my-0">Notes:</label>
          <textarea
            class="form-control form-control-sm"
            rows="3"
            id="orderNotes"
            v-model.trim="order.orderNotes"
          ></textarea>
        </div>
        <div class="form-group">
          <label for="customerNotes" class="small my-0">Notes to Customer:</label>
          <textarea
            class="form-control form-control-sm"
            rows="3"
            id="customerNotes"
            v-model.trim="order.customerNotes"
          ></textarea>
        </div>
      </div>
      <div class="col-sm-7 border-left border-right mb-0">
        <div class="row">
          <div class="form-group mb-1 col-sm-6">
            <label for="accountNum" class="small my-0">Account #</label>
            <input
              type="text"
              class="form-control form-control-sm"
              id="accountNum"
              v-model.trim="order.accountNum"
            >
          </div>
          <div class="form-group mb-1 col-sm-6">
            <label for="client" class="small my-0">Client</label>
            <input
              type="text"
              class="form-control form-control-sm capitalized"
              id="client"
              v-model.trim="order.client"
              ref="client"
            >
          </div>
          <div class="form-group mb-1 col-sm-6">
            <label for="contactName" class="small my-0">Contact Name</label>
            <input
              type="text"
              class="form-control form-control-sm capitalized"
              id="contactName"
              v-model.trim="order.contactName"
              ref="contactName"
            >
          </div>
          <div class="form-group mb-1 col-sm-6">
            <label for="shipToName" class="small my-0">Ship To Name</label>
            <input
              type="text"
              class="form-control form-control-sm capitalized"
              id="shipToName"
              v-model.trim="order.shipToName"
              ref="shipToName"
            >
          </div>
          <div class="form-group mb-1 col-sm-12">
            <label for="shipToAddress" class="small my-0">Ship To Address</label>
            <input
              type="text"
              class="form-control form-control-sm capitalized"
              id="shipToAddress"
              v-model.trim="order.shipToAddress"
              ref="shipToAddress"
            >
          </div>
          <div class="form-group mb-1 col-sm-6">
            <label for="shipToCity" class="small my-0">City</label>
            <input
              type="text"
              class="form-control form-control-sm capitalized"
              id="shipToCity"
              v-model.trim="order.shipToCity"
              ref="shipToCity"
            >
          </div>
          <div class="form-group mb-1 col-sm-6">
            <label for="shipToCountry" class="small my-0">Country</label>
            <input
              type="text"
              class="form-control form-control-sm"
              id="shipToCountry"
              v-model.trim.lazy="order.shipToCountry"
              @change="setCountryUpper"
              ref="shipToCountry"
            >
          </div>
          <div
            class="form-group mb-1 col-sm-6"
            v-if="order.shipToCountry === 'CA'|| order.shipToCountry ==='CANADA' || order.shipToCountry ==='CAN'"
          >
            <label for="shipToProvState" class="small my-0">Province</label>
            <select
              class="form-control form-control-sm"
              id="shipToProvState"
              v-model="order.shipToProvState"
              @change="setProvTax"
              ref="province"
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
            v-else-if="order.shipToCountry ==='USA'|| order.shipToCountry==='US' || order.shipToCountry==='UNITED STATES'"
          >
            <label for="shipToProvState" class="small my-0">State</label>
            <select
              class="form-control form-control-sm"
              id="shipToProvState"
              v-model="order.shipToProvState"
              @change="setTaxOther(0)"
              ref="state"
            >
              <option
                v-for="(state, index) in states"
                :value="state.abbrev"
                :key="index"
              >{{state.abbrev}} - {{state.state}}</option>
            </select>
          </div>
          <div class="form-group mb-1 col-sm-6" v-else>
            <label for="shipToProvState" class="small my-0">State/Prov</label>
            <input
              type="text"
              class="form-control form-control-sm capitalized"
              id="shipToProvState"
              v-model.trim="order.shipToProvState"
              @change="setTaxOther(0)"
              ref="provincestate"
            >
          </div>

          <div class="form-group mb-1 col-sm-6">
            <label for="shipToPostalZip" class="small my-0">Zip/Postal</label>
            <input
              type="text"
              class="form-control form-control-sm uppercase"
              id="shipToPostalZip"
              v-model.trim="order.shipToPostalZip"
              ref="shipToPostalZip"
            >
          </div>
          <div class="form-group mb-1 col-sm-6">
            <label for="contactPhone" class="small my-0">Phone</label>
            <input
              type="text"
              class="form-control form-control-sm"
              id="contactPhone"
              v-model.trim="order.contactPhone"
              ref="contactPhone"
            >
          </div>
          <div class="form-group mb-1 col-sm-6">
            <label for="contactEmail" class="small my-0">Email</label>
            <input
              type="text"
              class="form-control form-control-sm"
              id="contactEmail"
              v-model.trim="order.contactEmail"
            >
          </div>
          <div class="form-group col-sm-12 mb-1">
            <label for="approvedTerms" class="small my-0">Terms</label>
            <input
              type="text"
              class="form-control form-control-sm"
              id="approvedTerms"
              v-model.trim="order.approvedTerms"
            >
          </div>
          <div class="form-group col-sm-12">
            <label for="signedOffDate" class="small my-0">Signed-Off Date</label>
            <DatePicker
              v-model="order.signedOffDate"
              :bootstrapStyling="true"
              :use-utc="true"
              input-class="form-control form-control-sm"
              :disabled="true"
            ></DatePicker>
          </div>
        </div>
      </div>
      <div class="col-sm-2">
        <div class="form-group mb-1" v-if="order.prePacks === 0 || order.prePacks === null">
          <label for="multiShips" class="small my-0">Multi-Ships</label>
          <input
            type="number"
            class="form-control form-control-sm"
            id="multiShips"
            min="0"
            v-model.number="order.multiShips"
          >
        </div>
        <div class="form-group mb-1" v-if="order.multiShips === 0 || order.multiShips === null">
          <label for="prePacks" class="small my-0">Pre-Packs</label>
          <input
            type="number"
            class="form-control form-control-sm"
            id="prePacks"
            min="0"
            v-model.number="order.prePacks"
          >
        </div>
        <div class="form-group mb-1">
          <label for="revisionCharge" class="small my-0">Extra Revisions</label>
          <input
            type="number"
            class="form-control form-control-sm"
            id="revisionCharge"
            min="0"
            step="25"
            v-model.number="order.revisionCharge"
          >
        </div>

        <div class="form-group mb-2 mt-3">
          <label for="currency" class="small my-0">Currency</label>
          <select
            class="form-control form-control-sm"
            id="currency"
            v-model="order.currency"
            disabled
          >
            <option value="CAD">CAD</option>
            <option value="USD">USD</option>
          </select>
        </div>
        <div class="mb-1">
          <label for="taxes" class="small my-0">Taxes</label>
          <input
            type="number"
            class="form-control form-control-sm"
            id="taxes"
            min="0"
            max="50"
            v-model.number="order.taxes"
          >
        </div>
      </div>
    </div>
    <div class="card-footer bg-dark text-right">
      <button type="button" class="btn btn-success" @click.prevent="commitChanges">Commit Changes</button>
    </div>
  </div>
</template>

<script>
import DatePicker from "vuejs-datepicker";

export default {
  name: "EditDetails",
  components: {
    DatePicker
  },
  data() {
    return {
      isCommitted: false
    };
  },
  beforeRouteLeave(to, from, next) {
    if (this.isCommitted) {
      next();
    } else {
      alert("You must click commit to leave this page!");
      next(false);
    }
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
    formatPrice(value) {
      let val = (value / 1).toFixed(2);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    setProvTax(e) {
      let index = e.target.selectedIndex;
      if (index >= 0) {
        let tax = this.provs[index].tax;
        this.$store.dispatch("setProvTax", tax);
      }
    },
    setTaxOther(tax) {
      this.$store.dispatch("setProvTax", tax);
    },
    setCountryUpper(e) {
      let text = e.target.value;
      text = text.toUpperCase();
      this.$store.dispatch("setCountryUpper", text);
    },
    commitChanges() {
      if (
        this.$refs.province != undefined &&
        this.$refs.province.value === ""
      ) {
        this.$refs.province.focus();
        alert("Province not selected");
        return;
      }

      if (this.$refs.state != undefined && this.$refs.state.value === "") {
        this.$refs.state.focus();
        alert("State not selected");
        return;
      }

      if (
        this.$refs.provincestate != undefined &&
        this.$refs.provincestate.value === ""
      ) {
        this.$refs.provincestate.focus();
        alert("Province/State not entered");
        return;
      }

      if (this.$refs.client != undefined && this.$refs.client.value === "") {
        this.$refs.client.focus();
        alert("Contact Name not entered");
        return;
      }
      if (
        this.$refs.shipToName != undefined &&
        this.$refs.shipToName.value === ""
      ) {
        this.$refs.shipToName.focus();
        alert("Ship To Name not entered");
        return;
      }
      if (
        this.$refs.shipToAddress != undefined &&
        this.$refs.shipToAddress.value === ""
      ) {
        this.$refs.shipToAddress.focus();
        alert("Address not entered");
        return;
      }
      if (
        this.$refs.shipToCity != undefined &&
        this.$refs.shipToCity.value === ""
      ) {
        this.$refs.shipToCity.focus();
        alert("City not entered");
        return;
      }
      if (
        this.$refs.shipToCountry != undefined &&
        this.$refs.shipToCountry.value === ""
      ) {
        this.$refs.shipToCountry.focus();
        alert("Country not entered");
        return;
      }

      if (
        this.$refs.shipToPostalZip != undefined &&
        this.$refs.shipToPostalZip.value === ""
      ) {
        this.$refs.shipToPostalZip.focus();
        alert("Postal/Zip not entered");
        return;
      }
      if (
        this.$refs.contactPhone != undefined &&
        this.$refs.contactPhone.value === ""
      ) {
        this.$refs.contactPhone.focus();
        alert("Phone # not entered");
        return;
      }

      this.isCommitted = true;

      this.$store.dispatch("setOrderTotal");
      this.$router.push({ path: `/${this.order.orderNum}` });
    }
  }
};
</script>

<style scoped>
.capitalized {
  text-transform: capitalize;
}

.uppercase {
  text-transform: uppercase;
}
</style>

