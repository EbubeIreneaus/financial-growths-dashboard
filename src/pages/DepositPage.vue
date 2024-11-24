<script setup lang="ts">
import { defineAsyncComponent, inject, reactive, ref } from 'vue';
import { useQuasar, QSpinnerFacebook } from 'quasar';
const depositSuccess = defineAsyncComponent(
  () => import('components/DepositSuccess.vue')
);

const userId = inject('userId');
const $q = useQuasar();
const backend = inject('backend');
const isDeposited = ref(false);

import { useNotify } from 'src/composables/notify';
let paymentForm = reactive({
  id: userId,
  amount: null,
  channel: 'BTC',
});

const options = [
  { value: 'USDT(ERC20)', label: 'USDT(ERC20)' },
  { value: 'BTC', label: 'BITCION' },
  { value: 'USDT(TRC20)', label: 'USDT(TRC20)' },
  { value: 'BNB', label: 'BNB' },
  { value: 'ETH', label: 'ETHEREUM' },
];

async function saveOrder() {
  if (paymentForm.amount == null || paymentForm.amount == '') {
    alert('please fill in the payment form');
    return false;
  }

  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: 'yellow',
    spinnerSize: 140,
    message: 'please wait a little, while we proccess your request',
  });

  try {
    const req = await fetch(`${backend}/order/deposit`, {
      method: 'post',
      body: JSON.stringify(paymentForm),
    });
    if (!req.ok) {
      $q.loading.hide();
      return useNotify(
        'error',
        'Server Error Occured',
        'please try again, thank you!'
      );
    }
    const res = await req.json();

    if (res.status == 'failed') {
      $q.loading.hide();
      return useNotify('error', 'Invalid Request', res.code);
    }

    $q.loading.hide();
    isDeposited.value = true;
  } catch (error) {}
}
</script>
<template>
  <div
    class="full-width row justify-center items-center q-pa-sm"
    style="min-height: 400px"
  >
    <div style="max-width: 768px">
      <div class="text-h4 text-positive text-weight-bold text-center q-mb-md">
        Secured Payment Methods
      </div>
      <div class="text-body1 text-center q-mb-lg">
        Payment is 100% secured. Below are well integrated payment options in
        our platform.
      </div>

      <div>
        <q-input
          type="number"
          step="50"
          v-model="paymentForm.amount"
          placeholder="0.00"
          label="Amount(USD)"
          label-color="positive"
          standout
          prefix="$"
          class="text-white"
          dark
        />
      </div>
      <div class="q-pa-lg">
        <q-option-group
          v-model="paymentForm.channel"
          type="radio"
          :options="options"
          dark
          color="positive"
        >
          <template v-slot:label="opt">
            <div class="row items-center">
              <span class="text-teal">{{ opt.label }}</span>
              <!-- <q-icon :name="opt.icon" color="teal" size="1.5em" class="q-ml-sm" /> -->
            </div>
          </template>
        </q-option-group>
      </div>

      <q-btn color="positive" class="q-mt-md" @click="saveOrder()"
        >save and continue</q-btn
      >
    </div>

    <deposit-success
      v-if="isDeposited"
      :channel="paymentForm.channel"
      @close-deposit-dialog="() => (isDeposited = false)"
    />
  </div>
</template>
