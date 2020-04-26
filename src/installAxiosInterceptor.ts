import { AxiosStatic } from 'axios';
import router from "@/router";
import store from "@/store";
import { UPDATE_APP_MESSAGE } from './store/mutation-types';
import { LOGIN_OUT } from './store/actions';

const showDebugErrorMsg = function (error: any) {
    const { response: { config } } = error;

    store.commit(UPDATE_APP_MESSAGE, {
        msg: `${config.url}<br> ${error.message}`,
        position: "bottom",
        type: "",
        timeout: 0,
        debug: true
    });
}

export default function (axios: AxiosStatic) {
    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
        // Do something before request is sent
        const token = localStorage.getItem("user_token");
        config.headers["Authorization"] = `Bearer ${token}`;
        return config;
    }, function (error) {
        // Do something with request error
        return Promise.reject(error);
    });

    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        const data: ResponseModel<any> = response.data;
        if (data.state !== 0) {
            const error = { response, message: data.msg, data };
            showDebugErrorMsg(error);
            return Promise.reject(error);
        }
        return response;
    }, function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error

        if (error.response.status === 401) {
            store.dispatch(LOGIN_OUT);
            router.push('/login');
            store.commit(UPDATE_APP_MESSAGE, {
                msg: "您还未登录或登录已过期，请重新登录！",
                color: "info",
                timeout: 3000,
                position: "top"
            })
        } else {
            showDebugErrorMsg(error);
        }

        return Promise.reject(error);
    });
}
