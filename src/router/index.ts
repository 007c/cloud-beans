import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);


export const routes = [
  {
    path: '/home',
    name: 'Home',
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue")
  },
];


const router = new VueRouter({
  routes,
});

export default router;
