import { boot } from 'quasar/wrappers'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
function moneyFmt(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
    notation: 'compact'
  }).format(amount)
}
export default boot(async ({ app }) => {
  app.directive('money', {
    mounted(el, binding){
      const money = binding.value
      el.innerText = moneyFmt(money)
    },

    updated(el, binding){
      const money = binding.value
      el.innerText = moneyFmt(money)
    },
  })
})
