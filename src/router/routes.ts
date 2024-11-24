import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue') },
      {path: 'account', component: () => import('pages/AccountPage.vue')},
      // {path: 'deposit', component: ()=> import('pages/DepositPage.vue')},
      {path: 'invest', component: ()=> import('pages/InvestPage.vue')},
      {path: 'withdraw', component: ()=> import('pages/WithdrawalPage.vue')},
      {path: 'affliate', component: ()=> import('pages/AffliatePage.vue')},
    ],
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Auth/SignUp.vue') },
      { path: 'logout', component: () => import('pages/Auth/LogoutPage.vue') },
      { path: 'fgetpass', component: () => import('pages/Auth/FgetpassPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
