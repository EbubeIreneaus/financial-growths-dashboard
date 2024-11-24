<script setup lang="tsx">
import { useNotify } from 'src/composables/notify';
import { inject, onBeforeMount, reactive, ref } from 'vue';
import { useQuasar } from 'quasar';

const userId = inject('userId');
const backend = inject('backend');
const $q = useQuasar()

const nameLoading = ref(false);
const pswLoading = ref(false)

const user = ref({
  fullname: '',
  email: '',
});

let psw = reactive({
  psw: '',
});
const confirm = ref('');

async function getUser() {
  const res = await (await fetch(`${backend}/userInfo?id=${userId}`)).json();
  if (res.id) {
    user.value = res;
    return true;
  }
  // router.push('/auth')
}

async function updateName() {
  nameLoading.value = true;
  try {
    const res = await (
      await fetch(
        `${backend}/update/fullname?id=${userId}&name=${user.value.fullname}`
      )
    ).json();
    if (res.status == 'success') {
      return (nameLoading.value = false);
    }
    nameLoading.value = false;
    return useNotify(
      'error',
      'request error',
      'could not save new name at the moment'
    );
  } catch (error) {
    nameLoading.value = false;
    return useNotify(
      'error',
      'server error',
      'could not save new name at the moment'
    );
  }
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function resetPassword(){
  if(psw.psw.length < 6 || psw.psw !== confirm.value){
    return $q.notify({
      message: 'please check your password correctly',
      color: 'red-14',
      icon: 'error'
    })
  }
  pswLoading.value = true
  try {
    const res = await (
      await fetch(
        `${backend}/update/password?id=${userId}&psw=${psw.psw}`
      )
    ).json();
    if (res.status == 'success') {
     pswLoading.value = false
      psw.psw = ''
      confirm.value = ''
      $q.notify({
        message: 'password updated..',
        color: 'green-14',
        icon: 'check_circle'
      })
      return true
    }
    pswLoading.value=false
    return useNotify(
      'error',
      'request error',
      'could not save new password at the moment'
    );
  } catch (error) {
    pswLoading.value=false
    return useNotify(
      'error',
      'server error',
      'could not save new password at the moment'
    );
  }
}

onBeforeMount(() => {
  getUser();
});
</script>
<template>
  <div class="full-width full-height row items-center q-py-xl q-px-md">
    <div class="full-width" style="max-width: 768px">
      <q-form autocorrect="off" spellcheck="false" >
        <fieldset class="q-pa-lg q-mb-lg">
          <legend>Personal</legend>
          <q-input
            outlined
            v-model="user.fullname"
            dark
            color="white"
            label="Fullname"
            label-color="positive"
            class="q-mb-md"
            @blur="updateName"
            :loading="nameLoading"
          />
          <q-input
            outlined
            v-model="user.email"
            dark
            color="white"
            label="Email Address"
            label-color="positive"
            class="q-mb-md"
            readonly
          />
        </fieldset>
        <fieldset class="q-pa-lg">
          <legend>Password</legend>
          <q-input
            label="Password"
            type="password"
            label-color="positive"
            required
            filled
            dark
            color="white"
            v-model="psw.psw"
            class="q-mb-md"
            :rules="[val => val && val.lenght > 6 || 'please enter password with not less than 6 characters']"
          />
          <q-input
            label="Confirm"
            type="password"
            label-color="positive"
            required
            filled
            dark
            color="white"
            v-model="confirm"
            class="q-mb-md"
            :rules="[val => val && val.lenght > 6 || 'please enter password with not less than 6 characters']"
          />
          <q-btn color="positive" @click="resetPassword()" :loading="pswLoading">save password</q-btn>
        </fieldset>
      </q-form>
    </div>
  </div>
</template>
