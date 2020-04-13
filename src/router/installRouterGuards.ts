import VueRouter from 'vue-router';
import store from "@/store";

export default function(router: VueRouter) {
    router.beforeEach(function(to, from, next) {
        const isLogin = store.getters.isLogin;

        if (to.path === "/login" && isLogin) {
            next("/home");
            return;
        }

        if (to.meta && to.meta.requireLogin) {
            if (!isLogin) {
                next({
                    path: "/login",
                    query: {
                        redirect: to.fullPath
                    }
                });
                return;
            }
        }

        next();
    })
}
