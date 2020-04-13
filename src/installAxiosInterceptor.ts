import { AxiosStatic } from 'axios';
import router from "@/router";
import store from "@/store";
import { SET_USER_TOKEN, UPDATE_APP_ERROR_MESSAGE, APP_ERROR_MESSAGE_STATUS } from './store/mutation-types';


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
            store.commit(UPDATE_APP_ERROR_MESSAGE, data.msg);
            setTimeout(() => {
                store.commit(APP_ERROR_MESSAGE_STATUS, false);
            }, 5000)
            return Promise.reject({
                response,
                message: data.msg
            });
        }
        return response;
    }, function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        const { response: { config } } = error;

        store.commit(UPDATE_APP_ERROR_MESSAGE, `${config.url}<br> ${error.message}`);
        console.log(error)
        return Promise.reject(error);
    });
}
