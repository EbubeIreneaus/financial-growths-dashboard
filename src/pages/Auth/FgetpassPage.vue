<script lang="ts" setup>
import { useQuasar } from 'quasar';
import EmailVerification from 'src/components/Auth/EmailVerification.vue';
import { inject, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const email_verification_dialog = reactive({
  show: false,
  email: '',
  label: '',
});

const backend = inject('backend')

const $q = useQuasar();

async function get_account_associated_with_email(email: string){
  try {
    let res = await(await fetch(`${backend}/auth/getAcct?email=${email}`)).json()

    if (res.status == 'failed') {
      alert(res.code)
      return prompt()
    }

    $q.cookies.set('userId', res.userId)
    email_verification_dialog.email = email
    email_verification_dialog.show = true

  } catch (error) {

  }
}

function prompt(){
  $q.dialog({
  title: 'Authorize Access To Account',
  dark: true,
  message:
    'Once your account is confirmed, you will be automatically logged in to your dashboard. From there, you can update your password and manage your account profile. \n \n Please enter the email address associated with your account to proceed.',
  prompt: {
    model: '',
    type: 'text', // optional
  },
  cancel: true,
  persistent: true,
})
  .onOk((data) => {
   if(data == '' || data == undefined || data.length < 1 || !data.lastIndexOf('@')){
    alert('Please enter a valid email to access your account.')
    prompt()
   }else{
    get_account_associated_with_email(data)
   }
  })
  .onCancel(() => {
    router.push('/auth')
  })
  .onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  });
}

prompt()
</script>

<template>
  <email-verification
    :email="email_verification_dialog.email"
    label="Authorize Access To Account"
    v-if="email_verification_dialog.show"
  />
</template>
