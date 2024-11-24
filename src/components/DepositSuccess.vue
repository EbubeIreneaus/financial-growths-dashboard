<script setup lang="ts">
import { useCopy } from 'src/composables/clipboard';
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
type CryptoKey = 'USDT(TRC20)';
let dialog = ref(true);
const paymentAddress = ref<CryptoKey>('USDT(TRC20)');

const emit = defineEmits(['closeDepositDialog']);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const paymentOption: any = {
  'USDT(TRC20)': {
    address: 'TNjKts9eymPyQbWXexrP2ZcHJ32pRYXF1U',
    img: 'images/tether-usdt-logo.png',
  },
};

let crypto = computed<CryptoKey>(() => paymentAddress.value);
const cryptoAddress = computed(() => paymentOption[crypto.value].address);

function madePayment() {
  $q.notify({
    message: 'Thank you for choosing us.',
    icon: 'check_circle',
    color: 'green-14',
  });
  emit('closeDepositDialog');
}
</script>

<template>
  <div>
    <q-dialog
      v-model="dialog"
      backdrop-filter="blur(4px) saturate(150%)"
      persistent
    >
      <q-card dark style="max-width: 400px; width: 100%">
        <q-card-section>
          <div class="tw-flex tw-justify-between tw-items-center">
            <div class="text-body1">Confirm my payment</div>
            <q-select
              v-model="paymentAddress"
              :options="['USDT(TRC20)']"
              dense
              dark
              filled
            ></q-select>
          </div>
        </q-card-section>
        <q-card-section>
          <q-img
            :src="paymentOption[crypto].img"
            width="200px"
            fit="scale-down"
            class="tw-mx-auto tw-block"
          >
            <template v-slot:error>
              <div
                class="absolute-full flex flex-center bg-negative text-white"
              >
                Cannot load image
              </div>
            </template>
          </q-img>
        </q-card-section>
        <!-- if payment channel not MEMO -->
        <q-card-section>
          <div class="text-caption text-center q-py-md">
            kindly make deposit to the below wallet address <q>{{ crypto }}</q>
          </div>
          <q-input
            v-model="cryptoAddress"
            readonly
            standout
            dark
            label="Payment Wallet Address"
          >
            <template v-slot:append>
              <q-icon
                name="content_copy"
                @click="useCopy(cryptoAddress)"
              ></q-icon>
            </template>
          </q-input>
        </q-card-section>

        <q-card-section>
          <q-btn color="accent" @click="madePayment"
            >I have made my payment</q-btn
          >
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
