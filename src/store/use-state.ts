import { Module } from "vuex";
import { UPDATE_USER_INFO, SET_USER_LOGIN_STATE, UPDATE_STUDENT_INFO } from "./mutation-types";

export interface UserState {
    userInfo: UserInfo;
    studentInfo: StudentInfo;
    isLogin: boolean;
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
    const userInfo = localStorage.getItem("user_info");
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
        isLogin: false
    }
    if (!userInfo || new Date() > new Date(Number(expiredAt))) {
        localStorage.removeItem("user_info");
        localStorage.removeItem("expired_at");
    } else {
        initialState.userInfo = JSON.parse(userInfo!);
        initialState.isLogin = true;
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
        [SET_USER_LOGIN_STATE](state, isLogin: boolean) {
            state.isLogin = isLogin;
        },
        [UPDATE_STUDENT_INFO]({ studentInfo }, payload: StudentInfo) {
            const keys = (Object.keys(payload) as Array<keyof StudentInfo>);
            for (const key of keys) {
                studentInfo[key] = payload[key] as never;
            }
        }
    }
}

export default userState;
