<script lang="ts" setup>
import Swal from 'sweetalert2';
import { inject, reactive, ref, onMounted } from 'vue';
import { useQuasar, QSpinnerFacebook } from 'quasar';
import { useNotify } from 'src/composables/notify';

const $q = useQuasar();
const backend = inject('backend');
const userId = inject('userId');
const withdrawOptions = ['USDT(TRC20)'];
let balance = ref(0.0);
const withdrawForm = reactive({
  id: userId,
  wallet: '',
  channel: 'USDT(TRC20)',
  amount: null as unknown as number,
});

async function getAccount() {
  fetch(`${backend}/accountInfo`, {
    method: 'get',
    headers: {
      'X-API-Key': userId ? userId.toString() : '',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      balance.value = data.balance;
    })
    .catch((err) => {
      console.error(err.message);
    });
}

function resetForm() {
  withdrawForm.wallet = '';
  withdrawForm.channel = '';
  withdrawForm.amount = 0;
}

async function saveOrder() {
  if (withdrawForm.amount < 1 || withdrawForm.wallet == '') {
    alert('please fill in the whthdrawal form');
    return false;
  }

  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: 'yellow',
    spinnerSize: 140,
    message: 'please wait a little, while we proccess your request',
  });

  try {
    const req = await fetch(`${backend}/order/withdraw`, {
      method: 'post',
      body: JSON.stringify(withdrawForm),
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
    Swal.fire({
      title: 'Successful!',
      text: 'We have recieve your request and we are proccessing it.',
      icon: 'success',
      confirmButtonText: 'Cool',
      background: '#02022a',
      color: '#ffffff',
    });
    return resetForm();
  } catch (error) {}
}
onMounted(() => {
  getAccount();
});
</script>

<template>
  <div class="q-pa-lg">
    <q-banner class="bg-accent q-py-md q-px-lg" dark>
      <div>Wallet Balance</div>
      <div class="text-h4 q-my-sm"><div v-money="balance"></div></div>
      <div></div>
    </q-banner>

    <div>
      <fieldset class="q-pa-lg q-my-lg" style="max-width: 768px">
        <legend>Wallet Information</legend>
        <q-form spellcheck="off">
          <q-select
            v-model="withdrawForm.channel"
            :options="withdrawOptions"
            dark
            label="Channel"
            filled
            class="q-mb-md"
          ></q-select>
          <q-input
            v-model="withdrawForm.amount"
            dark
            label="Amount"
            filled
            class="q-mb-md"
            required
          ></q-input>
          <q-input
            v-model="withdrawForm.wallet"
            dark
            label="Wallet Address"
            filled
            class="q-mb-md"
            required
          ></q-input>
          <br />
          <q-btn color="positive" @click="saveOrder()">Initiate Withdraw</q-btn>
        </q-form>
      </fieldset>
    </div>
  </div>
</template>
