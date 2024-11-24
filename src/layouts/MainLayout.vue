<template>
  <q-layout view="lHh Lpr lFf" class="bg-primary text-white">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          {{ activePage }}
        </q-toolbar-title>

        <q-btn round class="q-mx-lg">
          <q-avatar>
            <img src="../assets/admin-user.jpg" alt="" />
          </q-avatar>
          <q-menu class="bg-accent text-white">
            <div class="row no-wrap q-pa-md">
              <!-- <div class="column">
                <div class="text-h6 q-mb-md">Settings</div>
              </div>

              <q-separator vertical inset class="q-mx-lg" /> -->

              <div class="column items-center">
                <q-avatar size="72px">
                  <img src="../assets/admin-user.jpg" />
                </q-avatar>

                <div class="text-subtitle1 q-mt-md q-mb-xs">{{ userInfo.fullname }}</div>

                <q-btn
                  color="primary"
                  label="Logout"
                  push
                  size="sm"
                  v-close-popup
                />
              </div>
            </div>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      class="bg-primary"
      elevated
      :width="250"
    >
      <q-list class="full-height text-white" padding>
        <q-item-label header class="q-py-lg"> </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
          @click="activePage = link.title"
          class="q-mb-md"
        />
      </q-list>
    </q-drawer>

    <q-page-container class="">
      <router-view :userInfo="userInfo" />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { inject, onMounted, provide, ref } from 'vue';
import { useRouter } from 'vue-router';
import EssentialLink, {
  EssentialLinkProps,
} from 'components/EssentialLink.vue';
import { useQuasar } from 'quasar';

const router = useRouter()
const $q = useQuasar()
defineOptions({
  name: 'MainLayout',
});

// const fabPos = ref([ 18, 18 ])
// const draggingFab = ref(false)


let userId = ref(null)

const backend = inject('backend')
const activePage = ref<string>('Dashboard');

const linksList: EssentialLinkProps[] = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    link: '/',
  },
  {
    title: 'Profile',
    icon: 'manage_accounts',
    link: '/account',
  },
  // {
  //   title: 'Wallet',
  //   icon: 'account_balance_wallet',
  //   link: '',
  // },
  // {
  //   title: 'Deposit',
  //   icon: 'payments',
  //   link: '/deposit',
  // },
  {
    title: 'Invest',
    icon: 'savings',
    link: '/invest',
  },
  {
    title: 'Withdraw',

    icon: 'account_balance',
    link: '/withdraw',
  },
  {
    title: 'Affliate',
    icon: 'diversity_2',
    link: '/affliate',
  },
  {
    title: 'Logout',
    icon: 'logout',
    link: '/auth/logout',
  },
];

const userInfo = ref({
  fullname: '',
  email: '',
  id: ''
})

function checkuser_and_getuser(){
  if ($q.cookies.has('userId')) {
    userId.value = $q.cookies.get('userId')
  }else{
    router.push('/auth')
  }
}
checkuser_and_getuser()
provide('userId', userId.value )

async function getUser(){
  try {
    const res = await ((await fetch(`${backend}/userInfo?id=${userId.value}`)).json())
    if(res.id){
      userInfo.value = res
      provide('user', res)
      return true

    }
    router.push('/auth')
  } catch (error) {
    router.push('/auth')
  }
}


const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

onMounted(() => {
  getUser()

});
</script>
