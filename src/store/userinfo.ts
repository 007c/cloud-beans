import { Module } from "vuex";
import { UPDATE_USER_INFO } from "./mutation-types";

interface UserInfoState {
    userName?: string;
    nickName?: string;
    avatar?: string;
    phoneNumber?: string;
    grade?: number | undefined;
    rank?: number | undefined;
    source?: string;
}

const userInfo: Module<UserInfoState, any> = {
    state: {
        userName: '--',
        nickName: '--',
        avatar: '',
        phoneNumber: '--',
        grade: undefined,
        rank: undefined,
        source: '--'
    },

    mutations: {
        [UPDATE_USER_INFO](state, payload: UserInfoState) {
            const keys = (Object.keys(payload) as Array<keyof UserInfoState>);
            for (const key of keys) {
                state[key] = payload[key] as never;
            }
        }
    }
}

export default userInfo;
