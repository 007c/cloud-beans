import store from './store';
import { SET_APP_LOGIN_GUIDE_STATUS } from './store/mutation-types';

export let reslove: () => any;
export let reject: () => any;

export function startAsyncGuide() {
    store.commit(SET_APP_LOGIN_GUIDE_STATUS, true)
    return new Promise((rsl, rjt) => {
        reslove = rsl;
        reject = rjt;
    }).then(() => {
        store.commit(SET_APP_LOGIN_GUIDE_STATUS, false);
    })
}

export const getReslover = function () {
    return reslove;
}
export const getRejecter = function () {
    return reject;
}
