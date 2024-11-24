<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="tsx" setup>
import { defineAsyncComponent, inject, reactive, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
const DepositDialog = defineAsyncComponent(
  () => import('src/components/DepositSuccess.vue')
);

const $q = useQuasar();
const userId = inject('userId');
const backend = inject('backend');
const isLoading = ref(false);
const showDepositDialog = ref(false);

const plans = [
  {
    label: 'Starter',
    value: 'starter',
    min: 50,
    max: 499,
    roi: '20%',
    duration: '24 hours',
  },
  {
    label: 'Basic',
    value: 'basic',
    min: 500,
    max: 3999,
    roi: '30%',
    duration: '48 hours',
  },
  {
    label: 'Silver',
    value: 'silver',
    min: 4000,
    max: 9999,
    roi: '60%',
    duration: '72 hours',
  },

  {
    label: 'Gold',
    value: 'gold',
    min: 10000,
    max: 20000,
    roi: '80%',
    duration: '92 hours',
  },
  {
    label: 'Real Estate',
    value: 'estate',
    min: 20500,
    max: Infinity,
    roi: '100%',
    duration: '120 hours',
  },
];
const investForm = reactive({
  id: userId,
  plan: 'starter',
  amount: 50,
});

function resetForm() {
  investForm.amount = 50;
  investForm.plan = 'starter';
}

function saveOrder() {
  isLoading.value = true;
  fetch(`${backend}/order/invest`, {
    method: 'post',
    body: JSON.stringify(investForm),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      isLoading.value = false;
      if (data.status) {
        showDepositDialog.value = true;
        resetForm();
        return
      }
      $q.notify({
        message: data.code,
        color: 'red-14',
        icon: 'error',
      });
    })
    .catch((err) => {
      isLoading.value = false;
      return $q.notify({
        message: err.message,
        color: 'red-14',
        icon: 'error',
      });
    });
}

function validateInput(val: number) {
  if (!val) {
    return 'This field is required';
  }

  if (!parseInt(val.toString())) {
    return 'please enter a valid number';
  }
  if (val < 50) {
    return 'minimum amount is USD50';
  }
  for (const plan of plans) {
    let v = parseInt(val.toString());

    if (plan.min <= v && plan.max >= v && investForm.plan != plan.value) {
      return 'Please enter amount that matches your plan';
    }
  }
  return true;
}

watch(
  () => investForm.amount,
  (val: any) => {
    if (val == null) {
      return false;
    }
    for (const plan of plans) {
      let v = parseInt(val.toString());
      if (plan.min <= v && plan.max >= v) {
        investForm.plan = plan.value;
        return;
      }
    }
  }
);

watch(
  () => investForm.plan,
  (val: any) => {
    for (const plan of plans) {
      if (plan.value == val) {
        investForm.amount = plan.min;
        return;
      }
    }
  }
);
</script>
<template>
  <div>
    <div
      class="full-width row justify-center items-center q-pa-md"
      style="min-height: 400px"
    >
      <div style="max-width: 768px">
        <div class="text-h4 text-positive text-weight-bold text-center q-mb-md">
          Invest In Your Feature, Invest Today
        </div>
        <div class="text-body1 text-center q-mb-lg">
          Investing with us 100% secured. Below are the investment plans in our
          platform.
        </div>

        <div>
          <q-input
            type="number"
            step="50"
            v-model="investForm.amount"
            placeholder="0.00"
            label="Amount(USD)"
            label-color="positive"
            filled
            prefix="$"
            class="text-white"
            dark
            :rules="[validateInput]"
          />
        </div>
        <q-form>
          <ul>
            <li v-for="(plan, index) in plans" :key="index">
              <label>
                <input
                  type="radio"
                  :value="plan.value"
                  v-model="investForm.plan"
                  class="hidden tw-peer"
                />
                <div
                  class="tw-py-5 tw-px-2 tw-my-2 tw-rounded-lg tw-shadow tw-shadow-slate-500 peer-checked:!tw-ring"
                >
                  <div class="tw-flex tw-justify-between">
                    <p class="tw-uppercase">{{ plan.label }}</p>
                    <div class="tw-flex tw-gap-3">
                      <p v-money="plan.min" class="tw-font-mono"></p>
                      -
                      <p v-money="plan.max" class="tw-font-mono"></p>
                    </div>
                  </div>
                  <div class="tw-font-mono tw-text-base">
                    +{{ plan.roi }} every {{ plan.duration }}
                  </div>
                </div>
              </label>
            </li>
          </ul>
        </q-form>
        <q-btn
          color="positive"
          class="q-mt-md"
          @click="saveOrder"
          :loading="isLoading"
          >invest now</q-btn
        >
      </div>
    </div>
    <div>
      <deposit-dialog
        v-if="showDepositDialog"
        @close-deposit-dialog="() => (showDepositDialog = false)"
      />
    </div>
  </div>
</template>

<style scoped></style>
