import { Module } from "vuex";
import { UPDATE_USER_INFO, SET_USER_TOKEN, UPDATE_STUDENT_INFO } from "./mutation-types";
import { LOGIN_OUT, GET_USER_BASE_INFO } from './actions';
import axios from "axios";

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
    provinceCode?: number;
    highSchoolId?: number;
}

export enum Subject {
    "文科" = 1,
    "理科" = 2
}

export interface UserInfo {
    userName?: string;
    nickName?: string;
    avatar?: string;
    phoneNumber?: string;
    role?: string;
    id?: string;
    originalInfo?: GradeInfoModel | null
}

const getIntialState = function (): UserState {
    const userToken = localStorage.getItem("user_token");
    const expiredAt = localStorage.getItem("expired_at");
    const initialState: UserState = {
        userInfo: {
            userName: '',
            nickName: '',
            avatar: '',
            phoneNumber: '',
            role: '',
            id: '',
            originalInfo: null
        },
        studentInfo: {
            grade: "",
            rank: "",
            source: '',
            province: "",
            subject: null,
            provinceCode: undefined,
            highSchoolId: undefined
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

    actions: {
        [LOGIN_OUT]({ commit }) {
            localStorage.removeItem("user_token");
            localStorage.removeItem("expired_at");
            commit(SET_USER_TOKEN, "");
            location.reload();
        },
        async [GET_USER_BASE_INFO]({ commit }) {
            const rsp = await axios.get<ResponseModel<GradeInfoModel>>(
                "/api/UserScoreRank/GetModel"
            );

            const { data } = rsp.data;
            const studentInfo: StudentInfo = {
                grade: data.score,
                rank: data.rank,
                provinceCode: data.provinceCode,
                subject: data.divisionTypeID,
                highSchoolId: data.highSchoolID
            };
            const userInfo: UserInfo = {
                avatar: data.logoUrl,
                phoneNumber: data.mobile,
                id: data.userID,
                originalInfo: data
            };
            commit(UPDATE_STUDENT_INFO, studentInfo);
            commit(UPDATE_USER_INFO, userInfo);
        }
    },

    getters: {
        isLogin(state): boolean {
            return state.token !== "";
        }
    }
}

export default userState;
