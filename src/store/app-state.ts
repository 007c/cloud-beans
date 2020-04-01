import { Module } from "vuex";
import {
    INCREMENT_REQUEST_COUNT,
    REDUCE_REQUEST_COUNT,
    UPDATE_APP_ERROR_MESSAGE
} from "./mutation-types"
export interface AppState {
    pendingRequest: number;
    mode: string;
    appErrorMsg: string;
    shouldShowErrorMsg: boolean;
}

const appState: Module<AppState, any> = {
    state: {
        pendingRequest: 0,
        mode: process.env.NODE_ENV,
        appErrorMsg: '',
        shouldShowErrorMsg: false
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
            if(state.mode !== "production") {
                state.shouldShowErrorMsg = true;
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