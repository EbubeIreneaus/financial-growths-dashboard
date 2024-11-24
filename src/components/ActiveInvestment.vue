<script lang="ts" setup>
import { QTableColumn } from 'quasar';
import { ref, inject, onMounted } from 'vue';

const userId = inject('userId');
const backend = inject('backend');

const tableRow = ref([]);

const tableColumn: QTableColumn[] = [
  {
    name: 'id',
    label: 'orderId',
    field: 'orderId',
    required: true,
    align: 'left',
  },
  {
    name: 'plan',
    label: 'Plan',
    field: 'plan',
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

async function getActiveOrders() {
  try {
    const active_investment = await (
      await fetch(`${backend}/order/active?id=${userId}`)
    ).json();
    tableRow.value = active_investment;
  } catch (error) {
    console.error('Error getting active investment', error);
  }
}

onMounted(() => {
  getActiveOrders();
});
</script>

<template>
  <div class="">
    <q-table
      separator="none"
      :columns="tableColumn"
      card-class="bg-primary text-white"
      title="Active Orders"
      row-key="id"
      :rows="tableRow"
      class="bg-accent text-white q-px-md"
    >
      <template v-slot:body="props">
        <tr>
          <td>{{ props.row.orderId }}</td>
          <td>{{ props.row.plan }}</td>
          <td><div v-money="props.row.amount"></div></td>
          <td><q-icon color="green-13" :name="props.row.active?'check_circle':'error'" /></td>
        </tr>
      </template>
    </q-table>
  </div>
</template>
