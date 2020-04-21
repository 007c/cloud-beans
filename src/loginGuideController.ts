import store from './store';
import { SET_APP_LOGIN_GUIDE_STATUS } from './store/mutation-types';

let resloveGuide: () => any;
let rejectGuide: () => any;

export function startAsyncGuide() {
    store.commit(SET_APP_LOGIN_GUIDE_STATUS, true)
    return new Promise((reslove, reject) => {
        resloveGuide = reslove;
        rejectGuide = reject;
    }).then(() => {
        store.commit(SET_APP_LOGIN_GUIDE_STATUS, false);
    })
}

export const getReslover = function () {
    return resloveGuide;
}
export const getRejecter = function () {
    return rejectGuide;
}
