<template>
	<div class="card border-dark">
		<div class="card-header bg-dark text-light p-2">
			<div class="row align-items-center m-0">
				<div class="col-sm-2">
					<span>Order Details</span>
				</div>
				<div
					class="col-sm-2 d-print-none align-items-center"
					v-if="disabledEdit === false"
				>
					<input
						type="checkbox"
						class="form-check-input"
						id="need3d"
						v-model="order.need3d"
						@change="saveNotes"
					/>
					<label class="form-check-label" for="need3d">Require 3D</label>
				</div>
				<div
					class="col-sm-2 d-print-none align-items-center"
					v-if="disabledEdit == false"
				>
					<input
						type="checkbox"
						class="form-check-input"
						id="needSketch"
						v-model="order.needSketch"
						@change="saveNotes"
					/>
					<label class="form-check-label" for="needSketch"
						>Require Mock-Up</label
					>
				</div>
				<div class="col-sm-2 d-print-none align-items-center">
					{{ order.use2020Pricing ? '2020 Pricing' : '2019 Pricing' }}
				</div>
			</div>
		</div>
		<div class="row card-body p-2">
			<div class="col-sm-3">
				<ul class="list-group list-group-flush">
					<li class="list-group-item">
						Order:
						<span>{{ order.orderNum }}</span>
					</li>
					<li class="list-group-item">
						Custom Rep:
						<span>{{ order.isr }}</span>
					</li>
					<li class="list-group-item">
						<label for="outRep">Outside Rep:</label>
						<input
							type="text"
							class="form-control form-control-sm"
							id="outRep"
							v-model.lazy="order.outRep"
							@change="saveNotes"
							:readonly="disabledEdit"
						/>
					</li>
					<li class="list-group-item">
						Order Date:
						<span>{{ formatDate(order.enteredDate) }}</span>
					</li>
					<li class="list-group-item" v-if="order.eventDate">
						Event Date:
						<span>{{ formatDate(order.eventDate) }}</span>
					</li>
					<li class="list-group-item" v-if="order.eventDate">
						In-Hand Date:
						<span>{{ formatDate(order.latestInHand) }}</span>
					</li>
					<li class="list-group-item">
						<label for="customerPO">Customer PO:</label>
						<input
							type="text"
							class="form-control form-control-sm"
							id="customerPO"
							v-model.trim.lazy="order.customerPO"
							@change="saveNotes"
							:readonly="disabledEdit"
						/>
					</li>
				</ul>
				<div class="text-center">
					<label for="customerNotes" class="mb-0 mt-2"
						>Notes to Customer:</label
					>
					<textarea
						v-model.lazy="order.customerNotes"
						class="form-control form-control-sm"
						rows="3"
						style="font-size: 12px; white-space: pre-wrap;"
						id="customerNotes"
						@change="saveNotes"
						:readonly="disabledEdit"
					></textarea>
				</div>
				<div class="d-print-none text-center">
					<label for="orderNotes" class="mb-0 mt-2">Internal Notes:</label>
					<textarea
						v-model.lazy="order.orderNotes"
						class="form-control form-control-sm"
						rows="3"
						style="font-size: 12px; white-space: pre-wrap;"
						id="orderNotes"
						@change="saveNotes"
						:readonly="disabledEdit"
					></textarea>
				</div>
			</div>
			<div class="col-sm-6 border-left">
				<div class="row m-0">
					<ul class="list-group list-group-flush col-sm-6">
						<li class="list-group-item">
							Account #:
							<span>{{ order.accountNum }}</span>
						</li>
						<li class="list-group-item">
							Contact:
							<span>{{ order.contactName }}</span>
						</li>
					</ul>
					<ul class="list-group list-group-flush col-sm-6">
						<li class="list-group-item">
							Client:
							<span>{{ order.client }}</span>
						</li>
						<li class="list-group-item">
							Ship To Name:
							<span>{{ order.shipToName }}</span>
						</li>
					</ul>
					<ul class="list-group list-group-flush col-sm-12">
						<li class="list-group-item">
							Ship To Address:
							<br />
							<span>{{ order.shipToAddress }}</span>
						</li>
					</ul>
					<ul class="list-group list-group-flush col-sm-6">
						<li class="list-group-item">
							City:
							<span>{{ order.shipToCity }}</span>
						</li>
						<li class="list-group-item">
							Country:
							<span>{{ order.shipToCountry }}</span>
						</li>
						<li class="list-group-item">
							Phone:
							<span>{{ order.contactPhone }}</span>
						</li>
					</ul>
					<ul class="list-group list-group-flush col-sm-6">
						<li class="list-group-item">
							State/Prov:
							<span>{{ order.shipToProvState }}</span>
						</li>
						<li class="list-group-item">
							Zip/Postal:
							<span class="postal">{{ order.shipToPostalZip }}</span>
						</li>
						<li class="list-group-item">
							Email:
							<span style="text-transform: none;">{{
								order.contactEmail
							}}</span>
						</li>
					</ul>
					<ul class="list-group list-group-flush col-sm-12">
						<li class="list-group-item">
							Terms:
							<span>{{ order.approvedTerms }}</span>
						</li>
						<li class="list-group-item">
							Signed Off Date:
							<span>{{ formatDate(order.signedOffDate) }}</span>
						</li>
					</ul>
				</div>
			</div>
			<div class="col-sm-3 border-left text-center">
				<ul class="list-group list-group-flush">
					<li class="list-group-item">
						Currency:
						<span>{{ order.currency }}</span>
					</li>
					<li v-if="order.multiShips > 0" class="list-group-item">
						MultiShips:
						<span
							>{{ order.multiShips }} @ $15 = ${{
								formatPrice(order.multiShips * 15)
							}}</span
						>
					</li>
					<li v-if="order.prePacks > 0" class="list-group-item">
						PrePacks:
						<span
							>{{ order.prePacks }} @ $5 = ${{
								formatPrice(order.prePacks * 5)
							}}</span
						>
					</li>
					<li v-if="order.priorityShipping > 0" class="list-group-item">
						Priority Shipping:
						<span>${{ formatPrice(order.priorityShipping) }}</span>
					</li>
					<li v-if="order.revisionCharge > 0" class="list-group-item">
						Extra Revisions:
						<span>${{ formatPrice(order.revisionCharge) }}</span>
					</li>

					<li v-if="order.taxes" class="list-group-item">
						Sub Total:
						<span>${{ formatPrice(order.beforeTaxes) }}</span>
					</li>
					<li
						v-if="order.taxes"
						class="list-group-item"
						style="border-bottom:none;"
					>
						Taxes: {{ order.taxes }}% |
						<span>${{ formatPrice(order.taxAmount) }}</span>
					</li>
				</ul>
				<div class="col-sm-12 mb-2 p-1 text-center border border-3 rounded">
					<span style="font-size: 18px; font-weight: bold;">
						Total:
						<br />
						${{ formatPrice(order.netValue) }}
					</span>
				</div>
				<div class="mb-2 p-1 text-center border rounded">
					<h6>
						Balance Due:
						<br />
						${{ formatPrice(order.balanceOutstanding) }}
					</h6>
				</div>
				<div class="border-top pt-2" v-if="disabledEdit === false">
					<router-link
						tag="button"
						:to="`/${this.order.orderNum}/editdetails`"
						class="btn btn-success btn-block d-print-none"
						>Edit Details</router-link
					>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import moment from 'moment';

export default {
	name: 'OrderDetails',
	computed: {
		order() {
			return this.$store.state.order;
		},
		disabledEdit() {
			return this.$store.getters.disableEdit;
		}
	},
	methods: {
		formatPrice(value) {
			let val = (value / 1).toFixed(2);
			return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		},
		formatDate(date) {
			if (date) {
				return moment(date)
					.utc()
					.format('DD-MMM-YYYY');
			} else {
				return null;
			}
		},
		saveNotes() {
			this.$store.dispatch('saveOrder');
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
