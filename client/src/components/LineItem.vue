<template>
  <div class="item card border-dark mb-2 nobreak" v-if="item.cancelled === false">
    <div class="card-header bg-info text-light p-1">
      <div class="row align-items-center m-0">
        <div class="col-sm-1 d-print-none align-items-center ml-3" v-if="order.needSketch">
          <input
            type="checkbox"
            class="form-check-input"
            id="sketchOnly"
            v-model="item.sketchOnly"
            @change="saveNotes"
          >
          <label class="form-check-label" for="sketchOnly">Mock</label>
        </div>
        <div class="col-sm-2">Item: {{item.itemNumber}}</div>
        <div class="col-sm-4">Description: {{item.extendedDescription}}</div>
        <div class="col">StyleCode: {{item.styleCode}}</div>
        <div class="col">JBA: {{item.jbaCode}}</div>
      </div>
    </div>
    <div class="card-body p-1">
      <div class="row align-items-center text-center">
        <div class="col" v-if="item.itemNote">
          Item Note:
          <span>{{item.itemNote}}</span>
        </div>
        <div class="col">Ink: {{item.inkType}}</div>
        <div v-if="item.childReference" class="col-sm-2">Child Ref#: {{item.childReference}}</div>
        <div class="col">Thread: {{item.thread}}</div>
        <div v-if="item.zipper" class="col">Zipper: {{item.zipper}}</div>
        <div v-if="item.contrast" class="col">Contrast: {{item.contrast}}</div>
        <div v-if="item.zap" class="col" style="font-size: 16px;">
          <span class="badge badge-dark">ZAP - $5/unit | {{formatPrice(5*item.totalUnits)}}</span>
        </div>
        <div v-if="item.personalization" class="col" style="font-size: 16px;">
          <span class="badge badge-dark">PRS - $10/unit | {{formatPrice(10*item.totalUnits)}}</span>
        </div>
      </div>
      <div class="row align-items-center text-center m-0 rounded bg-light">
        <div class="col-sm-12 p-1">Quantities:</div>
        <div class="col" v-if="item.one">
          ONE:
          <span>{{item.one}}</span>
        </div>
        <div class="col-sm-12 p-1" v-else>
          <div class="row m-0">
            <div class="col" v-if="item.xxs > 0">
              2XS:
              <span>{{item.xxs}}</span>
            </div>
            <div class="col" v-if="item.xs > 0">
              XS:
              <span>{{item.xs}}</span>
            </div>
            <div class="col" v-if="item.s > 0">
              S:
              <span>{{item.s}}</span>
            </div>
            <div class="col" v-if="item.m > 0">
              M:
              <span>{{item.m}}</span>
            </div>
            <div class="col" v-if="item.l > 0">
              L:
              <span>{{item.l}}</span>
            </div>
            <div class="col" v-if="item.xl > 0">
              XL:
              <span>{{item.xl}}</span>
            </div>
            <div class="col" v-if="item.xxl > 0">
              2XL:
              <span>{{item.xxl}}</span>
            </div>
            <div class="col" v-if="item.xxxl > 0">
              3XL:
              <span>{{item.xxxl}}</span>
            </div>
          </div>
        </div>
      </div>
      <hr class="my-2">
      <div class="row m-0 p-0">
        <div class="col text-center" v-if="orderLine.graphicColours > 0">
          <div class="row">
            <div v-if="item.colour1" class="col-sm-12">Colour 1: {{item.colour1}}</div>
            <div v-if="item.colour2" class="col-sm-12">Colour 2: {{item.colour2}}</div>
            <div v-if="item.colour3" class="col-sm-12">Colour 3: {{item.colour3}}</div>
          </div>
        </div>
        <div class="col text-center">
          Total Units
          <br>
          <span style="font-weight: bold; font-size: 14px;">{{item.totalUnits}}</span>
        </div>

        <div class="col text-center">
          Unit Price ({{order.currency}}{{priceBreak}})
          <br>
          <span style="font-weight: bold; font-size: 14px;">$ {{formatPrice(unitPrice)}}</span>
        </div>

        <div v-if="item.itemDiscount > 0" class="col text-center">
          Discount
          <br>
          <span
            style="font-weight: bold; font-size: 14px;"
          >{{item.itemDiscount}}% (-${{formatPrice(discountAmount)}})</span>
        </div>

        <div v-if="qdDiscount > 0" class="col text-center">
          QD Discount:
          <br>
          <span style="font-weight: bold; font-size: 14px;">10% (-${{formatPrice(qdDiscount)}})</span>
        </div>

        <div class="col text-center">
          Final Unit Price
          <br>
          <span style="font-weight: bold; font-size: 14px;">$ {{formatPrice(item.finalUnitPrice)}}</span>
        </div>
      </div>
      <div class="card-footer p-1">
        <div class="float-left m-0 d-print-none" v-if="disabledEdit === false">
          <router-link
            tag="button"
            :to="`/edititem/${this.lineIndex}/${this.index}`"
            class="btn btn-sm btn-success mr-1"
          >Edit Item</router-link>
          <button class="btn btn-sm btn-danger" @click.prevent="cancelItem">Cancel Item</button>
        </div>
        <div class="row text-center float-right m-0" style="font-weight: bold; font-size: 12px;">
          <div v-if="discountTotal > 0" class="col bg-primary text-white rounded p-1">
            Discount Total:
            <br>
            ${{formatPrice(discountTotal)}}
          </div>
          <div
            class="col"
            style="font-size: 16px;"
          >Item Total: ${{formatPrice(item.itemTotalPrice)}}</div>
          <div v-if="item.addOns >0" class="col bg-dark rounded text-light p-1 ml-1">
            Add-Ons:
            <br>
            ${{formatPrice(item.addOns * item.totalUnits)}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LineItem",
  props: ["lineIndex", "index", "lineNumber"],
  computed: {
    item() {
      return this.$store.state.order.orderLines[this.lineIndex].items[
        this.index
      ];
    },
    order() {
      return this.$store.state.order;
    },
    orderLine() {
      return this.$store.state.order.orderLines[this.lineIndex];
    },
    priceBreak() {
      return this.$store.state.order.orderLines[this.lineIndex].priceBreak;
    },
    unitPrice() {
      return this.$store.state.order.orderLines[this.lineIndex].items[
        this.index
      ].unitPrice;
    },
    discountAmount() {
      return this.item.unitPrice * (this.item.itemDiscount / 100);
    },
    discountTotal() {
      return (
        (this.item.unitPrice * (this.item.itemDiscount / 100) +
          this.qdDiscount) *
        this.item.totalUnits
      );
    },
    qdDiscount() {
      let qdDiscountAmount = 0;
      if (
        this.orderLine.graphicCode === "CUSTM" ||
        this.orderLine.graphicCode === null
      ) {
        qdDiscountAmount = 0;
      } else {
        if (
          this.orderLine.priceBreak == 2 ||
          this.orderLine.priceBreak == 6 ||
          this.orderLine.priceBreak == 12 ||
          this.orderLine.priceBreak == 13 ||
          this.orderLine.priceBreak == 24
        ) {
          qdDiscountAmount = this.unitPrice * 0.1;
        }
      }
      return qdDiscountAmount;
    },
    disabledEdit() {
      return this.$store.getters.disableEdit;
    }
  },
  methods: {
    formatPrice(value) {
      let val = (value / 1).toFixed(2);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    cancelItem() {
      let checkdelete = confirm("Are you sure?");
      if (checkdelete) {
        this.$store.dispatch("cancelItem", {
          lineIndex: this.lineIndex,
          itemIndex: this.index
        });
      }
    },
    saveNotes() {
      this.$store.dispatch("saveOrder");
    }
  }
};
</script>

<style>
.card {
  font-size: 12px;
}
span {
  font-size: 15px;
  font-weight: bold;
}

@media print {
  .nobreak {
    page-break-inside: avoid;
  }
}
</style>
