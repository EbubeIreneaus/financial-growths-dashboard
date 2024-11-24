<script lang="ts" setup>
import { useCopy } from 'src/composables/clipboard';
import { currencyFormater } from 'src/composables/money';
import { inject, onMounted, ref } from 'vue';
// import { useQuasar } from 'quasar';
// import { useNotify } from 'src/composables/notify';

// const $q = useQuasar();
const backend = inject('backend');
const userId = inject('userId');

const account = ref({
  balance: 0,
  affliate_commision: 0,
  user: {
    ref_by: {
      fullname: null
    }
  }
})

let referralLink = ref('https://dashboard.financial-growths.com/#/auth?r=');

async function getAccount() {
  fetch(`${backend}/accountInfo`, {
    method: 'get',
    headers: {
      'X-API-Key': userId ? userId.toString() : '',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      account.value = data;
      referralLink.value = `https://dashboard.financial-growths.com/#/auth?r=${data.user.id}`
    })
    .catch((err) => {
      console.error(err.message);
    });
}



onMounted(()=>{
  getAccount()
})
</script>
<template>
  <div>
    <div class="q-pa-lg">
      <div class="row q-gutter-x-sm">
        <q-card class="bg-accent col-md col-12 q-py-md rounded-xl" v-if="account.user.ref_by?.fullname">
          <q-card-section
            class="column justify-center items-center q-gutter-md"
          >
            <div class="text-h5">{{ account.user.ref_by.fullname}}</div>
            <div>Reffered By</div>
          </q-card-section>
        </q-card>

        <q-card class="bg-accent col-md col-12 q-py-md rounded-xl">
          <q-card-section
            class="column justify-center items-center q-gutter-md"
          >
            <div class="text-h5"><div v-money="account.affliate_commision"></div></div>
            <div>Total Commision</div>
          </q-card-section>
        </q-card>

        <q-card class="bg-accent col-md col-12 q-py-md rounded-xl">
          <q-card-section
            class="column justify-center items-center q-gutter-md"
          >
            <div class="text-h5">{{ currencyFormater(account.balance) }}</div>
            <div>Wallet Balance</div>
          </q-card-section>
        </q-card>

        <q-card class="bg-accent col-md col-12 q-py-md rounded-xl">
          <q-card-section
            class="column justify-center items-center q-gutter-md"
          >
            <div class="text-h5">$0.00</div>
            <div>Pending Commision</div>
          </q-card-section>
        </q-card>
      </div>

      <q-banner class="bg-accent text-positive q-my-lg">
        <div>
          Invite your family and friends to join us today and unlock the opportunity to earn up to $5,000 in commission when they invest with us!
        </div>
      </q-banner>

      <div>
        <q-input
          v-model="referralLink"
          readonly
          standout
          dark
          label="My Referral Link"
        >
        <template v-slot:append>
          <q-icon name="content_copy" @click="useCopy(referralLink)"></q-icon>
        </template>
      </q-input>
      </div>
    </div>
  </div>
</template>
