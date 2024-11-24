import { Notify } from 'quasar'

export async function useCopy(content: string){
  await navigator.clipboard.writeText(content)
  Notify.create({
    message: 'successfully copied to clipboard',
    position: 'top-right',
    icon: 'done',
    color: 'green-5'
  })
  
} 