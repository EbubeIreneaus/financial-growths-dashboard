<script setup>
import QOtp from 'quasar-app-extension-q-otp';
import { inject, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useInterval } from 'quasar';
const props = defineProps(['email', 'label']);
const backend = inject('backend');
const $q = useQuasar();
const { registerInterval, removeInterval } = useInterval();
const showDialog = true;
const timer = ref(0);
const isverifying = ref(false);
const userId = ref(null);
const router = useRouter();

function EncodeEmail(email) {
  let atIndex = email.lastIndexOf('@');
  let encodedEmail = '';
  encodedEmail += email.substring(0, 3);
  encodedEmail += '...';
  encodedEmail += email.substring(atIndex - 1, email.length);
  return encodedEmail;
}

function actionClick() {
  timer.value = 60;
  registerInterval(() => {
    if (timer.value < 1) {
      removeInterval();
    }
    timer.value--;
  }, 1000);
}

async function requestOTP() {
  actionClick();
  try {
    await fetch(
      `${backend}/requestOTP?id=${userId.value}&&label=${props.label}`
    );
  } catch (error) {}
}

async function VerifyOTP(otp) {
  isverifying.value = true;
  try {
    const req = await fetch(
      `${backend}/verifyOTP?id=${userId.value}&otp=${Number(otp)}`
    );

    if (!req.ok) {
      $q.notify({
        message: req.text,
        icon: 'error',
        color: 'red-14',
      });
      return (isverifying.value = false);
    }

    let res = await req.json();
    if (res.status) {
      return router.push('/');
    }

    isverifying.value = false;
    return $q.notify({
      message: res.code,
      icon: 'error',
      color: 'red-14',
    });
  } catch (error) {
    isverifying.value = false;
    return $q.notify({
      message: error.message,
      icon: 'error',
      color: 'red-14',
    });
  }
}
onMounted(() => {
  userId.value = $q.cookies.get('userId') || useRouter().push('/auth');
});
</script>

<template>
  <q-dialog v-model="showDialog" class="">
    <q-card class="full-width bg-accent text-white" style="max-width: 500px">
      <q-card-section>
        <div class="text-h6">Let us Know It's You</div>
        <div class="text-caption text-center q-pt-md">
          please enter the six(6) digit code sent to
          {{ EncodeEmail(props.email) }}
        </div>
      </q-card-section>
      <q-card-section class="row justify-center">
        <q-otp
          :num="6"
          input-styles="width:40px; height:40px;"
          field-classes="q-ml-xs q-mr-xs"
          dark
          outlined
          :disabled="isverifying"
          @complete="(code) => VerifyOTP(code)"
        />
      </q-card-section>
      <q-card-section>
        <div class="text-caption text-center">
          Didn't recieve any code?
          <q-btn
            flat
            unelevated
            dense
            :disabled="timer > 0"
            @click="requestOTP"
            >{{ timer > 0 ? `${timer}sec` : 'resend' }}</q-btn
          >
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
