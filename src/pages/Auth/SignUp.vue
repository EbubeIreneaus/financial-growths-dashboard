<script setup lang="ts">
import { defineAsyncComponent, inject, reactive, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter, useRoute } from 'vue-router';
import { COUNTRIES } from 'src/composables/countries';

const EmailVerificationComponent = defineAsyncComponent(
  () => import('components/Auth/EmailVerification.vue')
);
const $q = useQuasar();
const isRegistering = ref(false);
const isLoggingin = ref(false);
const showEmailVerificationDialog = ref(false);
const router = useRouter()
const route = useRoute()
const backend = inject('backend')
// const isLoggingIn = ref(false)

console.log(route.query.r)

const firstName= ref('')
const lastName = ref('')
const phonePrefix = ref('')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const country: any = ref(null)
const confirm = ref('')

const formRegister = reactive({
  fullname: '',
  email: '',
  country: '',
  phone : '',
  password: '',
  refId: route.query.r ?? null
});

watch([firstName, lastName], ()=>{
  return formRegister.fullname = firstName.value + ' ' + lastName.value
})

watch(()=>country.value, (val)=>{
  formRegister.country = val?.name
  for (let index = 0; index < COUNTRIES.length; index++) {
    if(COUNTRIES[index].name == val.name){
      return phonePrefix.value = COUNTRIES[index].mobileCode
    }
  }
})

const formLogin = reactive({
  Remember: false,
  email: '',
  password: '',
});

async function Register() {
  isRegistering.value = true;

  try {
    const req = await fetch(`${backend}/auth/signup`, {
      method: 'post',
      body: JSON.stringify(formRegister),
    });

    if (!req.ok) {
      // if request is not okay
      isRegistering.value = false;
      return false;
    }

    const res = await req.json();

    if (!res.status) {
      isRegistering.value = false;
      $q.notify({
        message: res.code,
        color: 'red-14',
        icon: 'error'
      })
      return
    }

    $q.cookies.set('userId', res.userId, {sameSite: 'Strict', secure: true});
    isRegistering.value = false;
    showEmailVerificationDialog.value = true

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    isRegistering.value = false;
    $q.notify({
      message: error.message,
      color: 'red-14',
      icon: 'error'
    })
  }
}


async function Login() {
  isLoggingin.value = true;

  try {
    const req = await fetch(`${backend}/auth/signin`, {
      method: 'post',
      body: JSON.stringify(formLogin),
      credentials: 'same-origin',
    });

    if (!req.ok) {
      // if request is not okay
      isLoggingin.value = false;
      return false;
    }

    const res = await req.json();

    if (res.status == 'unverified') {
      $q.cookies.set('userId', res.userId, {sameSite: 'Strict', secure: true});
      isLoggingin.value = false;
      return showEmailVerificationDialog.value = true
    }

    if (res.status == 'success') {
      $q.cookies.set('userId', res.userId);
      isLoggingin.value = false;
      return router.push('/')
    }

    $q.notify({
      message: res.code,
      icon: 'error',
      color: 'red-14'
    })
    return isLoggingin.value = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    isLoggingin.value = false;
    $q.notify({
      message: error.message,
      icon: 'error',
      color: 'red-14'
    })
  }
}

function validateConfirmPassword(val: string){
  if (val != formRegister.password) {
    return 'Password Mismatch'
  }
  if (val.length < 6) {
    return 'password must be six or more character long'
  }
  return true
}

</script>

<template>
  <div
    class="q-py-md-sm q-py-lg q-px-md-xl bg-primary row items-center"
    style="min-height: 100dvh"
  >
    <div
      class="row q-col-gutter-x-lg q-col-gutter-y-xl items-center text-white q-mx-md-auto q-px-md-xl q-px-lg full-width"
      style="max-width: 1228px"
    >

      <div class="col-md col-12">
        <div class="text-h4 q-mb-md">Login</div>
        <q-form @submit.prevent="Login">
          <q-input
            outlined
            v-model="formLogin.email"
            type="email"
            label="Email"
            class="q-mb-md text-white"
            label-color="positive"
            dark
            filled
          />
          <q-input
            outlined
            v-model="formLogin.password"
            type="password"
            label="Password"
            class="q-mb-md"
            label-color="positive"
            dark
            filled
          />
          <q-checkbox
            class=""
            label="Remember me"
            v-model="formLogin.Remember"
            checked-icon="task_alt"
            unchecked-icon="highlight_off"
            color="positive"
            keep-color
          ></q-checkbox>
          <q-btn rounded type="submit" class="q-px-xl block q-my-md" color="positive" :loading="isLoggingin"
            >submit</q-btn
          >
          <div class="h6">
            <router-link to="/auth/fgetpass">Forgot your password?</router-link>
          </div>
        </q-form>
      </div>

      <div class="col-md col-12">
        <div class="text-h4 q-mb-md">Register</div>
        <q-form @submit.prevent="Register()" class="row q-col-gutter-x-sm">
          <q-input
            outlined
            v-model="firstName"
            label="Firstname"
            class="q-mb-md col-md-6 col-12"
            label-color="positive"
            dark
            filled
            required
          />

          <q-input
            outlined
            v-model="lastName"
            label="Lastname"
            class="q-mb-md col-md-6 col-12"
            label-color="positive"
            dark
            filled
            requred
          />

          <q-input
            outlined
            v-model="formRegister.email"
            type="email"
            label="Email"
            class="q-mb-md col-12"
            label-color="positive"
            dark
            filled
            required
          />
          <q-select
            outlined
            :options="COUNTRIES"
            option-label="name"
            v-model="country"
            type="text"
            label="Country"
            class="q-mb-md col-md-6 col-12"
            label-color="positive"
            dark
            filled
          />

          <q-input
            outlined
            v-model="formRegister.phone"
            :prefix="phonePrefix"
            type="tel"
            label="Phone"
            class="q-mb-md col-md-6 col-12"
            label-color="positive"
            dark
            filled
          />
          <q-input
            outlined
            v-model="formRegister.password"
            type="password"
            label="Password"
            class="q-mb-md col-md-6 col-12"
            label-color="positive"
            dark
            filled
            :rules="[(val: string) => val && val.length > 6 || 'password must be six or more character long']"
          />
          <q-input
            outlined
            v-model="confirm"
            type="password"
            label="Confirm"
            class="q-mb-md col-md-6 col-12"
            label-color="positive"
            dark
            filled
            :rules="[validateConfirmPassword]"
          />
          <div class="q-py-md text-body1 text-weight-medium">
            Your personal data will be used to support your experience
            throughout this website, to manage access to your account, and for
            other purposes described in our privacy policy.
          </div>
          <q-btn
            rounded
            class="q-px-xl"
            color="positive"
            type="submit"
            :loading="isRegistering"
            >submit</q-btn
          >
        </q-form>
      </div>
    </div>
    <email-verification-component
      v-if="showEmailVerificationDialog"
      :email="isRegistering?formRegister.email:formLogin.email"
      label="Account Verification"
    ></email-verification-component>
  </div>
</template>
