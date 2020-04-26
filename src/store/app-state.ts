import { Module } from "vuex";
import {
    INCREMENT_REQUEST_COUNT,
    REDUCE_REQUEST_COUNT,
    UPDATE_APP_MESSAGE,
    SET_WX_SHARE_CONFIG,
    APP_ERROR_MESSAGE_STATUS,
    SET_APP_LOGIN_GUIDE_STATUS
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
    appErrorMsg: MessageInfo;
    shouldShowErrorMsg: boolean;
    wxShareConfig: WxShareConfig;
    shouldShowLoginGuide: boolean;
}

export interface MessageInfo {
    color: string;
    timeout: number;
    msg: string;
    position: "top" | "left" | "right" | "bottom",
    // only show in debug mode;
    debug?: boolean;
}

let timerId: number | undefined;

const appState: Module<AppState, any> = {
    state: {
        pendingRequest: 0,
        shouldShowLoginGuide: false,
        mode: process.env.NODE_ENV,
        appErrorMsg: {
            color: "",
            timeout: 0,
            msg: "",
            position: "bottom"
        },
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
        [UPDATE_APP_MESSAGE](state, payload: MessageInfo) {
            const { timeout, debug } = payload
            state.appErrorMsg = payload;
            state.shouldShowErrorMsg = true;
            if (debug && process.env.NODE_ENV === "production") {
                state.shouldShowErrorMsg = false;
            }

            if (timeout > 0) {
                clearTimeout(timerId);
                timerId = setTimeout(() => {
                    state.shouldShowErrorMsg = false;
                }, timeout);
            }
        },
        [SET_WX_SHARE_CONFIG](state, payload: { timeStamp: number, nonceStr: string, signature: string }) {
            state.wxShareConfig = {
                ...state.wxShareConfig,
                ...payload
            }
        },
        [APP_ERROR_MESSAGE_STATUS](state, status: boolean) {
            state.shouldShowErrorMsg = status;
        },
        [SET_APP_LOGIN_GUIDE_STATUS](state, status: boolean) {
            state.shouldShowLoginGuide = status;
        }
    },
    getters: {
        isPendingRequestExist(state) {
            return state.pendingRequest > 0;
        }
    }
}


export default appState;
