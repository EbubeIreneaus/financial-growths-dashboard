<style scoped>
.popup {
  visibility: hidden;
  position: fixed;
  top: 100px;
  right: 20px;
  padding: 10px;
  background-color: whitesmoke;
  color: black;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-width: 80%;
  text-align: center;
  transform: translateY(-50px);
  opacity: 0;
  transition: transform 0.5s ease, opacity 0.5s ease, visibility 0.5s;
}
.popup.show {
  visibility: visible;
  transform: translateY(0);
  opacity: 1;
}

.popup.hide {
  transform: translateY(-50px);
  opacity: 0;
  visibility: hidden;
}
</style>

<template>
  <router-view :userId="userId" />
  <div id="popup" class="popup"></div>
</template>

<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, provide } from 'vue';
defineOptions({
  name: 'App',
});

let url = process.env.DEV
  ? 'http://127.0.0.1:8000/api'
  : 'https://server.financial-growths.com/api';
provide('backend', url);
let userId = inject('userId');

let interval: string | number | NodeJS.Timeout | undefined;
const countries = [
  'United States',
  'Canada',
  'Germany',
  'France',
  'Australia',
  'Brazil',
  'India',
  'Japan',
  'China',
  'South Korea',
  'South Africa',
  'Russia',
  'Italy',
  'Mexico',
  'Netherlands',
  'Spain',
  'Sweden',
  'Switzerland',
  'Turkey',
  'United Kingdom',
  'Argentina',
  'Chile',
  'Colombia',
  'Denmark',
  'Finland',
  'Greece',
  'Hungary',
  'Ireland',
  'Israel',
  'New Zealand',
  'Norway',
  'Poland',
  'Portugal',
  'Saudi Arabia',
  'Singapore',
  'Thailand',
  'Ukraine',
  'United Arab Emirates',
  'Vietnam',
  'Malaysia',
];

const amounts = Array.from(
  { length: 40 },
  () => Math.floor(Math.random() * (5000 - 300 + 1)) + 300
);

function currencyFormatter(amount: number) {
  const fmt = new Intl.NumberFormat('en-Us', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  });
  return fmt.format(amount);
}

function showPopup() {
  const popup = document.getElementById('popup');

  // Generate random values for the popup
  const country = countries[Math.floor(Math.random() * countries.length)];
  let amount: string | number =
    amounts[Math.floor(Math.random() * amounts.length)];
  amount = currencyFormatter(amount);
  const action = Math.random() > 0.5 ? 'deposited' : 'withdrew';

  // Set the content and display the popup
  if (popup) {
    popup.innerHTML = `Someone from ${country} just ${action} <span class="font-mono font-bold">${amount}</span>`;
    popup.classList.add('show');

    // Hide the popup after 5 seconds
    setTimeout(() => {
      popup.classList.remove('show');
      popup.classList.add('hide');
    }, 5000);

    // Remove the 'hide' class after the animation completes to reset for the next display
    setTimeout(() => {
      popup.classList.remove('hide');
    }, 5500);
  }
}

onMounted(() => {
  interval = setInterval(showPopup, 15000);
});

onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>
