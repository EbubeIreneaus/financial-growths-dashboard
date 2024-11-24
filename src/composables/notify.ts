// eoorooror
import { Notify } from 'quasar';

export function useNotify(status: string, msg: string, caption: string){

  Notify.create({
    message: msg,
    caption: caption,
    icon: status == 'error' ? 'error' : 'task_alt',
    color: status == 'error' ? 'negative' : 'success',
  });

}
