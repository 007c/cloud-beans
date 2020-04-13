import { Module } from "vuex";
import { UPDATE_USER_INFO, SET_USER_TOKEN, UPDATE_STUDENT_INFO } from "./mutation-types";

export interface UserState {
    userInfo: UserInfo;
    studentInfo: StudentInfo;
    isLogin: boolean;
    token: string | undefined;
}

export interface StudentInfo {
    grade?: number | string;
    rank?: number | string;
    source?: string;
    province?: string;
    subject?: Subject | null;
}

export enum Subject {
    "文科",
    "理科"
}

export interface UserInfo {
    userName?: string;
    nickName?: string;
    avatar?: string;
    phoneNumber?: string;
    role?: string;
}

const getIntialState = function(): UserState {
    const userToken = localStorage.getItem("user_token");
    const expiredAt = localStorage.getItem("expired_at");
    const initialState: UserState = {
        userInfo: {
            userName: '',
            nickName: '',
            avatar: '',
            phoneNumber: '',
            role: ''
        },
        studentInfo: {
            grade: "",
            rank: "",
            source: '',
            province: "",
            subject: null
        },
        isLogin: false,
        token: ""
    }
    if (!userToken || new Date() > new Date(Number(expiredAt))) {
        localStorage.removeItem("user_token");
        localStorage.removeItem("expired_at");
    } else {
        initialState.token = userToken;
    }
    return initialState;
}

const userState: Module<UserState, any> = {
    state: getIntialState(),

    mutations: {
        [UPDATE_USER_INFO]({ userInfo }, payload: UserInfo) {
            const keys = (Object.keys(payload) as Array<keyof UserInfo>);
            for (const key of keys) {
                userInfo[key] = payload[key] as never;
            }
        },
        [UPDATE_STUDENT_INFO]({ studentInfo }, payload: StudentInfo) {
            const keys = (Object.keys(payload) as Array<keyof StudentInfo>);
            for (const key of keys) {
                studentInfo[key] = payload[key] as never;
            }
        },
        [SET_USER_TOKEN](state, token: string) {
            state.token = token;
        }
    },

    getters: {
        isLogin(state): boolean {
            return state.token !== "";
        }
    }
}

export default userState;
