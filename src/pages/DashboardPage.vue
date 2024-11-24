<template>
  <q-page class="q-px-lg">
    <div class="">
      <div class="row q-gutter-sm">
        <q-card class="bg-accent col-md col-12 q-py-md rounded-xl">
          <q-card-section class="row justify-between items-center">
            <div>
              <div class="text-h5">{{ currencyFormater(account.balance) }}</div>
              <div>Account Balance</div>
            </div>
            <q-icon
              name="account_balance_wallet"
              size="lg"
              color="secondary"
            ></q-icon>
          </q-card-section>
        </q-card>

        <q-card class="bg-accent col-md col-12 q-py-md rounded-xl">
          <q-card-section class="row justify-between items-center">
            <div>
              <div class="text-h5">
                {{ currencyFormater(account.active_investment) }}
              </div>
              <div>Active Investment</div>
            </div>
            <q-icon name="savings" size="lg" color="secondary"></q-icon>
          </q-card-section>
        </q-card>

        <q-card class="bg-accent col-md col-12 q-py-md rounded-xl">
          <q-card-section class="row justify-between items-center">
            <div>
              <div class="text-h5">
                {{ currencyFormater(account.total_withdrawal) }}
              </div>
              <div>Total Withdrawal</div>
            </div>
            <q-icon name="account_balance" size="lg" color="secondary"></q-icon>
          </q-card-section>
        </q-card>

        <q-card class="bg-accent col-md col-12 q-py-md rounded-xl">
          <q-card-section class="row justify-between items-center">
            <div>
              <div class="text-h5">
                {{ currencyFormater(account.total_earnings) }}
              </div>
              <div>Total Earning</div>
            </div>
            <q-icon name="attach_money" size="lg" color="secondary"></q-icon>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="q-pa-md q-gutter-sm">
      <q-banner rounded class="bg-accent text-white">
        <div class="text-white text-body1 q-py-lg">
          Hello {{ account.user.fullname.split(' ')[0] }} (Not
          {{ account.user.fullname.split(' ')[0] }}?
          <router-link to="/auth/logout" class="text-white">Log Out</router-link
          >)
        </div>
        <div class="q-py-lg text-body1">
          From your account dashboard you can make
          <router-link to="/deposit" class="text-white">Deposit</router-link>,
          manage your
          <router-link to="/account" class="text-white">Account</router-link>,
          and initiate
          <router-link to="/withdrawal" class="text-white"
            >Withdrawal</router-link
          >.
        </div>
      </q-banner>
    </div>

    <active-investment />

    <br />
    <br />

    <q-table
      :columns="tableColumn"
      title="Orders"
      row-key="id"
      :rows="tableRow"
      class="bg-accent text-white"
    ></q-table>
  </q-page>
</template>

<script setup lang="ts">
// import { ref } from 'vue';
import { useMeta } from 'quasar';
import { MetaOptions } from 'quasar/dist/types/meta';
import { QTableColumn } from 'quasar';
import { inject, onMounted, ref } from 'vue';
import { currencyFormater } from 'src/composables/money';
import ActiveInvestment from 'src/components/ActiveInvestment.vue';

const account = ref({
  balance: 0.0,
  active_investment: 0.0,
  total_withdrawal: 0.0,
  total_earnings: 0.0,
  user: {
    fullname: '',
  },
});
const userId = inject('userId');
const backend = inject('backend');
defineOptions({
  name: 'IndexPage',
});
let meta: MetaOptions = {
  title: 'Bitzoic Market:- Dashboard',
  script: {
    livecoinWidgetQuee: {
      src: 'https://www.livecoinwatch.com/static/lcw-widget.js',
      defer: 'true',
    },
  },
};

useMeta(meta);

const tableColumn: QTableColumn[] = [
  {
    name: 'id',
    label: 'orderId',
    field: 'orderId',
    required: true,
    align: 'left',
  },
  {
    name: 'type',
    label: 'Type',
    field: 'type',
    required: true,
    align: 'left',
    sortable: true,
  },
  {
    name: 'channel',
    label: 'Channel',
    field: 'channel',
    required: true,
    align: 'left',
    sortable: true,
  },
  {
    name: 'amount',
    label: 'Amount(USD)',
    field: 'amount',
    required: true,
    align: 'left',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    required: true,
    align: 'left',
    sortable: true,
  },
];

const tableRow = ref([]);

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
    })
    .catch((err) => {
      console.error(err.message);
    });
}

async function getOrders() {
  let req = await fetch(`${backend}/order?id=${userId}`);
  tableRow.value = await req.json();
}

onMounted(() => {
  getAccount();
  getOrders();
});
</script>
