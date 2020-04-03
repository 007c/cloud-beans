import { Module } from "vuex";
import {
    INCREMENT_REQUEST_COUNT,
    REDUCE_REQUEST_COUNT,
    UPDATE_APP_ERROR_MESSAGE,
    SET_WX_SHARE_CONFIG
} from "./mutation-types"

export interface WxShareConfig {
    appId: string; // 必填，公众号的唯一标识
    timestamp: number; // 必填，生成签名的时间戳，与生成签名的timestamp要一致
    nonceStr: string; // 必填，生成签名的随机串，与生成签名的nonceStr要一致
    signature: string; // 必填，签名
}

export interface AppState {
    pendingRequest: number;
    mode: string;
    appErrorMsg: string;
    shouldShowErrorMsg: boolean;
    wxShareConfig: WxShareConfig
}

const appState: Module<AppState, any> = {
    state: {
        pendingRequest: 0,
        mode: process.env.NODE_ENV,
        appErrorMsg: '',
        shouldShowErrorMsg: false,
        wxShareConfig: {
            appId: 'wx922d0b00cb4edb33',
            timestamp: new Date().valueOf(),
            nonceStr: '',
            signature: ''
        }
    },

    mutations: {
        [INCREMENT_REQUEST_COUNT](state) {
            state.pendingRequest += 1;
        },
        [REDUCE_REQUEST_COUNT](state) {
            state.pendingRequest -= 1;
        },
        [UPDATE_APP_ERROR_MESSAGE](state, msg: string) {
            state.appErrorMsg = msg;
            if (state.mode !== "production") {
                state.shouldShowErrorMsg = true;
            }
        },
        [SET_WX_SHARE_CONFIG](state, payload: { timeStamp: number, nonceStr: string, signature: string }) {
            state.wxShareConfig = {
                ...state.wxShareConfig,
                ...payload
            }
        }
    },
    getters: {
        isPendingRequestExist(state) {
            return state.pendingRequest > 0;
        }
    }
}


export default appState;
