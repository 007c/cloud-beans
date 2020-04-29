import VueRouter from 'vue-router';
import store from "@/store";
import { startAsyncGuide } from "@/loginGuideController";
import { GET_USER_BASE_INFO } from '@/store/actions';
export default function (router: VueRouter) {
    router.beforeEach(function (to, from, next) {
        const isLogin = store.getters.isLogin;

        if (to.path === "/login" && isLogin) {
            next("/home");
            return;
        }

        if (to.meta && to.meta.requireLogin) {
            if (!isLogin) {
                startAsyncGuide().then(function () {
                    next({
                        path: "/login",
                        query: {
                            redirect: to.fullPath
                        }
                    });
                }).catch(function () {
                    // cancel route
                })
                return;
            }

            // logined but not get user base info
            if (!store.state.userState.userInfo.id) {
                store.dispatch(GET_USER_BASE_INFO).then(() => {
                    next();
                })

                return;
            }
        }

        next();
    })
}
