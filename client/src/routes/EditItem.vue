<template>
  <div class="item card border-dark">
    <div class="card-header bg-dark text-light p-2">
      <div>Item#: {{item.itemNumber}}</div>
      <div
        class="badge badge-warning text-center ml-3"
        v-if="orderLine.graphicCode != 'CUSTM' && orderLine.graphicCode != null"
      >Quick Design Discount</div>
    </div>
    <div class="card-body p-3">
      <div class="row align-items-center mb-2">
        <div class="col-sm-3" v-if="!order.lgOrder && orderLine.useLGPricing != true">
          <label for="selectedStyle" class="small my-0">Style:</label>
          <select
            class="form-control form-control-sm"
            id="selectedStyle"
            v-model="item.selectedStyle"
            @change="selectStyle"
            ref="styleInput"
          >
            <option
              v-for="(style, index) in styles"
              :key="index"
              :index="index"
              :value="index"
              :disabled="style.inactive"
            >{{style.style}}-{{style.description}}</option>
          </select>
        </div>
        <div class="col-sm-3" v-if="order.lgOrder || orderLine.useLGPricing == true">
          <label for="selectedStyle" class="small my-0">Style:</label>
          <select
            class="form-control form-control-sm"
            id="selectedStyle"
            v-model="item.selectedStyle"
            @change="selectStyle"
            ref="styleInput"
          >
            <option
              v-for="(style, index) in lgstyles"
              :key="index"
              :index="index"
              :value="index"
            >{{style.style}}-{{style.description}}</option>
          </select>
        </div>
        <div class="col-sm-4" v-if="!order.lgOrder && orderLine.useLGPricing != true">
          <label for="selectedConfig" class="small my-0">Config:</label>
          <select
            class="form-control form-control-sm"
            id="selectedConfig"
            v-model="item.selectedConfig"
            @change="selectConfig"
            ref="configInput"
          >
            <option
              v-for="(config, index) in item.configs"
              :key="index"
              :index="index"
              :value="index"
            >{{config.extendedDescription}}</option>
          </select>
        </div>
        <div class="col-sm-4" v-if="order.lgOrder || orderLine.useLGPricing == true">
          <label for="selectedConfig" class="small my-0">Config:</label>
          <select
            class="form-control form-control-sm"
            id="selectedConfig"
            v-model="item.selectedConfig"
            @change="selectConfig"
            ref="configInput"
          >
            <option
              v-for="(config, index) in item.configs"
              :key="index"
              :index="index"
              :value="index"
            >{{config.extendedDescription}}</option>
          </select>
        </div>

        <div class="col-sm-3">StyleCode: {{item.styleCode}}</div>
        <div class="col-sm-2">JBA: {{item.jbaCode}}</div>
      </div>
      <div class="row align-items-center text-center">
        <div class="col">
          <label for="inkType" class="small my-0">Ink:</label>
          <select class="form-control form-control-sm" id="inkType" v-model="item.inkType">
            <option value="D">Standard</option>
            <option value="F">Fluorescent</option>
          </select>
        </div>
        <div class="col">
          <label for="childReference" class="small my-0">Child Ref#:</label>
          <input
            type="text"
            class="form-control form-control-sm"
            id="childReference"
            v-model.trim="item.childReference"
            ref="childReference"
          />
        </div>
        <div class="col">
          <label for="thread" class="small my-0">Thread:</label>
          <select
            class="form-control form-control-sm"
            id="thread"
            v-model="item.thread"
            ref="threadInput"
          >
            <option value="BLK">Black</option>
            <option value="WHT">White</option>
            <option value="GNM">Gun Metal</option>
            <option value="INC">Ink Blue</option>
            <option value="REF">Reflex Blue</option>
            <option value="IND">Indy</option>
            <option value="F1R">F1 Red</option>
            <option value="VPK">Victory Pink</option>
            <option value="FLY">Fly Green</option>
          </select>
        </div>
        <div class="col" v-if="item.zipperOptions.length">
          <label for="zipper" class="small my-0">Zipper:</label>
          <select
            class="form-control form-control-sm"
            id="zipper"
            v-model="item.zipper"
            ref="zipperInput"
          >
            <option v-for="(zipper, index) in item.zipperOptions" :key="index">{{zipper}}</option>
          </select>
        </div>
        <div class="col" v-if="item.contrastOptions.length">
          <label for="contrast" class="small my-0">Contrast:</label>
          <select
            class="form-control form-control-sm"
            id="contrast"
            v-model="item.contrast"
            ref="contrastInput"
          >
            <option v-for="(contrast, index) in item.contrastOptions" :key="index">{{contrast}}</option>
          </select>
        </div>
        <div class="col">
          <input
            class="form-check-input"
            type="checkbox"
            value="true"
            id="personalization"
            v-model="item.personalization"
            @change="addOns"
          />
          <label class="form-check-label" for="personalization">PRS - $10</label>
        </div>
        <div class="col">
          <input class="form-check-input" type="checkbox" id="zap" v-model="item.zap" disabled />
          <label class="form-check-label" for="zap">ZAP - $5</label>
        </div>
      </div>
      <hr class="my-2" />
      <div
        class="row align-items-center text-center"
        v-if="item.sizeRange ==='ONE' && item.sizeRange"
      >
        <div class="form-group col-sm-2 offset-sm-5">
          <label for="one" class="small my-0">ONE</label>
          <input
            type="number"
            class="form-control form-control-sm text-center"
            min="0"
            step="1"
            id="one"
            v-model.number="item.one"
            @change="setTotalUnits"
            ref="one"
          />
        </div>
      </div>
      <div
        class="row align-items-center text-center"
        v-else-if="item.sizeRange !=='ONE' && item.sizeRange"
      >
        <div class="form-group col sizeinput" v-if="item.sizeRange.includes('2XS')">
          <label for="xxs" class="small my-0">2XS</label>
          <input
            type="number"
            class="form-control form-control-sm text-center"
            min="0"
            step="1"
            id="xxs"
            v-model.number="item.xxs"
            @change="setTotalUnits"
            ref="xxs"
          />
        </div>
        <div class="form-group col sizeinput" v-if="item.sizeRange !== 'S,L'">
          <label for="xs" class="small my-0">XS</label>
          <input
            type="number"
            class="form-control form-control-sm text-center"
            min="0"
            step="1"
            id="xs"
            v-model.number="item.xs"
            @change="setTotalUnits"
            ref="xs"
          />
        </div>
        <div class="form-group col sizeinput">
          <label for="s" class="small my-0">S</label>
          <input
            type="number"
            class="form-control form-control-sm text-center"
            min="0"
            step="1"
            id="s"
            v-model.number="item.s"
            @change="setTotalUnits"
            ref="s"
          />
        </div>
        <div class="form-group col sizeinput" v-if="item.sizeRange !== 'S,L'">
          <label for="m" class="small my-0">M</label>
          <input
            type="number"
            class="form-control form-control-sm text-center"
            min="0"
            step="1"
            id="m"
            v-model.number="item.m"
            @change="setTotalUnits"
            ref="m"
          />
        </div>
        <div class="form-group col sizeinput">
          <label for="l" class="small my-0">L</label>
          <input
            type="number"
            class="form-control form-control-sm text-center"
            min="0"
            step="1"
            id="l"
            v-model.number="item.l"
            @change="setTotalUnits"
            ref="l"
          />
        </div>
        <div class="form-group col sizeinput" v-if="item.sizeRange !== 'S,L'">
          <label for="xl" class="small my-0">XL</label>
          <input
            type="number"
            class="form-control form-control-sm text-center"
            min="0"
            step="1"
            id="xl"
            v-model.number="item.xl"
            @change="setTotalUnits"
            ref="xl"
          />
        </div>
        <div
          class="form-group col sizeinput"
          v-if="item.sizeRange.includes('2XL') || item.sizeRange.includes('3XL')"
        >
          <label for="xxl" class="small my-0">2XL</label>
          <input
            type="number"
            class="form-control form-control-sm text-center"
            min="0"
            step="1"
            id="xxl"
            v-model.number="item.xxl"
            @change="setTotalUnits"
            ref="xxl"
          />
        </div>
        <div class="form-group col sizeinput" v-if="item.sizeRange.includes('3XL')">
          <label for="xxxl" class="small my-0">3XL</label>
          <input
            type="number"
            class="form-control form-control-sm text-center"
            min="0"
            id="xxxl"
            v-model.number="item.xxxl"
            @change="setTotalUnits"
            ref="xxxl"
          />
        </div>
      </div>
      <hr class="my-2" />
      <div class="row p-0 m-0 align-items-center text-center">
        <div class="col" v-if="orderLine.graphicColours > 0 || orderLine.colour1">
          <div class="row">
            <div class="form-group mb-1 col-sm-12">
              <label for="colour1" class="small my-0">Colour 1:</label>
              <select
                class="form-control form-control-sm"
                id="colour1"
                v-model="item.colour1"
                ref="colour1"
                @change="setFlo"
              >
                <option v-for="(swatch, index) in swatches" :key="index">{{swatch.swatchName}}</option>
              </select>
            </div>
            <div
              class="form-group mb-1 col-sm-12"
              v-if="orderLine.graphicColours >= 2 || orderLine.colour2"
            >
              <label for="colour2" class="small my-0">Colour 2:</label>
              <select
                class="form-control form-control-sm"
                id="colour2"
                v-model="item.colour2"
                ref="colour2"
                @change="setFlo"
              >
                <option v-for="(swatch, index) in swatches" :key="index">{{swatch.swatchName}}</option>
              </select>
            </div>
            <div
              class="form-group mb-1 col-sm-12"
              v-if="orderLine.graphicColours == 3 || orderLine.colour"
            >
              <label for="colour3" class="small my-0">Colour 3:</label>
              <select
                class="form-control form-control-sm"
                id="colour3"
                v-model="item.colour3"
                ref="colour3"
                @change="setFlo"
              >
                <option v-for="(swatch, index) in swatches" :key="index">{{swatch.swatchName}}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="col text-center">
          Total Units
          <br />
          <span>{{item.totalUnits}}</span>
        </div>

        <div class="col">
          Unit Price ({{order.currency}}{{priceBreak}})
          <br />
          <span>$ {{formatPrice(unitPrice)}}</span>
        </div>

        <div class="col-2 text-center">
          <label for="itemDiscountType" class="small my-0">Discount Type:</label>
          <select
            class="form-control form-control-sm text-center"
            id="itemDiscountType"
            v-model="item.itemDiscountType"
            @change="finalUnitPrice"
          >
            <option value="%">%</option>
            <option value="$">$</option>
          </select>
        </div>

        <div class="col">
          <label for="itemDiscount" class="small my-0">Discount - ${{formatPrice(discountAmount)}}</label>
          <input
            type="number"
            class="form-control form-control-sm text-center"
            min="0"
            step=".5"
            id="itemDiscount"
            @change="finalUnitPrice"
            v-model.number="item.itemDiscount"
            style="font-weight: bold; font-size: 14px;"
          />
        </div>

        <div class="col">
          Final Unit Price
          <br />
          <span>$ {{formatPrice(item.finalUnitPrice)}}</span>
        </div>
      </div>
    </div>

    <div class="card-footer bg-dark text-light p-2">
      <div style="width: 350px;" class="float-left">
        <label for="itemNote" class="small my-0">Item Note:</label>
        <input
          type="text"
          class="form-control form-control-sm"
          id="itemNote"
          placeholder="Enter item note here..."
          v-model.trim="item.itemNote"
        />
      </div>
      <button class="btn btn-sm btn-success float-right" @click.prevent="commitItem">Commit Item</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditItem',
  data() {
    return {
      itemIndex: this.$route.params.itemIndex,
      lineIndex: this.$route.params.lineIndex,
      isCommitted: false
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.isCommitted) {
      next()
    } else {
      alert('You must click commit to leave this page!')
      next(false)
    }
  },
  computed: {
    order() {
      return this.$store.state.order
    },
    orderLine() {
      return this.$store.state.order.orderLines[this.lineIndex]
    },
    item() {
      return this.$store.state.order.orderLines[this.lineIndex].items[this.itemIndex]
    },
    itemDiscountType() {
      if (this.$store.state.order.orderLines[this.linIndex].items[this.itemIndex].itemDiscountType === '$') {
        return '$'
      }

      return '%'
    },
    styles() {
      return this.$store.state.styles
    },
    lgstyles() {
      return this.$store.state.lgstyles
    },
    swatches() {
      return this.$store.state.swatches
    },
    priceBreak() {
      return this.$store.state.order.orderLines[this.lineIndex].priceBreak
    },
    unitPrice() {
      return this.$store.state.order.orderLines[this.lineIndex].items[this.itemIndex].unitPrice
    },
    discountAmount() {
      if (this.$store.state.order.orderLines[this.lineIndex].items[this.itemIndex].itemDiscountType === '%') {
        return this.item.unitPrice * (this.item.itemDiscount / 100)
      } else {
        return this.item.itemDiscount
      }
    }
  },
  methods: {
    formatPrice(value) {
      let val = (value / 1).toFixed(2)
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    selectStyle() {
      if (this.item.selectedStyle != -1) {
        this.$store.dispatch('setSelectedStyle', {
          lineIndex: this.lineIndex,
          itemIndex: this.itemIndex
        })
      }
    },
    selectConfig() {
      if (this.item.selectedConfig !== undefined || this.item.selectedConfig > -1) {
        this.$store.dispatch('setSelectedConfig', {
          lineIndex: this.lineIndex,
          itemIndex: this.itemIndex
        })
      }
    },
    setTotalUnits() {
      this.$store.commit('SET_ITEM_TOTAL_UNITS', {
        lineIndex: this.lineIndex,
        itemIndex: this.itemIndex
      })
    },
    addOns() {
      this.$store.commit('ADD_ONS', {
        lineIndex: this.lineIndex,
        itemIndex: this.itemIndex
      })
    },
    setFlo() {
      this.$store.commit('SET_FLO', {
        lineIndex: this.lineIndex,
        itemIndex: this.itemIndex,
        inkType: 'D'
      })

      if (this.$refs.colour1 != undefined) {
        if (this.$refs.colour1.value === 'ELECTRIC SALMON' || this.$refs.colour1.value.includes('Flo ')) {
          this.$store.commit('SET_FLO', {
            lineIndex: this.lineIndex,
            itemIndex: this.itemIndex,
            inkType: 'F'
          })
        }
      }

      if (this.$refs.colour2 != undefined) {
        if (this.$refs.colour2.value === 'ELECTRIC SALMON' || this.$refs.colour2.value.includes('Flo ')) {
          this.$store.commit('SET_FLO', {
            lineIndex: this.lineIndex,
            itemIndex: this.itemIndex,
            inkType: 'F'
          })
        }
      }

      if (this.$refs.colour3 != undefined) {
        if (this.$refs.colour3.value === 'ELECTRIC SALMON' || this.$refs.colour3.value.includes('Flo ')) {
          this.$store.commit('SET_FLO', {
            lineIndex: this.lineIndex,
            itemIndex: this.itemIndex,
            inkType: 'F'
          })
        }
      }
    },
    finalUnitPrice() {
      this.$store.dispatch('setFinalUnitPrice', {
        lineIndex: this.lineIndex,
        itemIndex: this.itemIndex
      })
    },
    commitItem() {
      if (this.$refs.styleInput.value === '') {
        this.$refs.styleInput.focus()
        alert('Style not selected!')
        return
      }
      if (this.$refs.configInput.value === '') {
        this.$refs.configInput.focus()
        alert('Configuration not selected!')
        return
      }

      if (this.$refs.threadInput.value === '') {
        this.$refs.threadInput.focus()
        alert('Thread not selected!')
        return
      }
      if (this.$refs.zipperInput != undefined && this.$refs.zipperInput.value === '') {
        this.$refs.zipperInput.focus()
        alert('Zipper not selected!')
        return
      }

      if (this.$refs.contrastInput != undefined && this.$refs.contrastInput.value === '') {
        this.$refs.contrastInput.focus()
        alert('Contrast not selected!')
        return
      }

      if (this.$refs.colour1 != undefined && this.$refs.colour1.value === '') {
        this.$refs.colour1.focus()
        alert('Fill in Colours for QD')
        return
      }
      if (this.$refs.colour2 != undefined && this.$refs.colour2.value === '') {
        this.$refs.colour2.focus()
        alert('Fill in Colours for QD')
        return
      }
      if (this.$refs.colour3 != undefined && this.$refs.colour3.value === '') {
        this.$refs.colour3.focus()
        alert('Fill in Colours for QD')
        return
      }

      if (this.$refs.one != undefined && this.$refs.one.value == '') {
        this.item.one = 0
        this.$store.commit('SET_ITEM_TOTAL_UNITS', {
          lineIndex: this.lineIndex,
          itemIndex: this.itemIndex
        })
      }
      if (this.$refs.xxs != undefined && this.$refs.xxs.value == '') {
        this.item.xxs = 0
        this.$store.commit('SET_ITEM_TOTAL_UNITS', {
          lineIndex: this.lineIndex,
          itemIndex: this.itemIndex
        })
      }
      if (this.$refs.xs != undefined && this.$refs.xs.value == '') {
        this.item.xs = 0
        this.$store.commit('SET_ITEM_TOTAL_UNITS', {
          lineIndex: this.lineIndex,
          itemIndex: this.itemIndex
        })
      }
      if (this.$refs.s != undefined && this.$refs.s.value == '') {
        this.item.s = 0
        this.$store.commit('SET_ITEM_TOTAL_UNITS', {
          lineIndex: this.lineIndex,
          itemIndex: this.itemIndex
        })
      }
      if (this.$refs.m != undefined && this.$refs.m.value == '') {
        this.item.m = 0
        this.$store.commit('SET_ITEM_TOTAL_UNITS', {
          lineIndex: this.lineIndex,
          itemIndex: this.itemIndex
        })
      }
      if (this.$refs.l != undefined && this.$refs.l.value == '') {
        this.item.l = 0
        this.$store.commit('SET_ITEM_TOTAL_UNITS', {
          lineIndex: this.lineIndex,
          itemIndex: this.itemIndex
        })
      }
      if (this.$refs.xl != undefined && this.$refs.xl.value == '') {
        this.item.xl = 0
        this.$store.commit('SET_ITEM_TOTAL_UNITS', {
          lineIndex: this.lineIndex,
          itemIndex: this.itemIndex
        })
      }
      if (this.$refs.xxl != undefined && this.$refs.xxl.value == '') {
        this.item.xxl = 0
        this.$store.commit('SET_ITEM_TOTAL_UNITS', {
          lineIndex: this.lineIndex,
          itemIndex: this.itemIndex
        })
      }
      if (this.$refs.xxxl != undefined && this.$refs.xxxl.value == '') {
        this.item.xxxl = 0
        this.$store.commit('SET_ITEM_TOTAL_UNITS', {
          lineIndex: this.lineIndex,
          itemIndex: this.itemIndex
        })
      }

      this.isCommitted = true

      this.$store.dispatch('setAddOns', this.lineIndex)
      this.$store.dispatch('setFinalUnitPrice', {
        lineIndex: this.lineIndex,
        itemIndex: this.itemIndex
      })
      this.$router.push({ path: `/${this.order.orderNum}` })
    }
  }
}
</script>

<style scoped>
span {
  font-weight: bold;
  font-size: 14px;
}

.sizeinput {
  max-width: 200px;
}
</style>
