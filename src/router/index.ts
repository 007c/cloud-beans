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
  {
    path: "/university/detail/:id",
    name: "universityDetail",
    component: () => import("../views/UniversityDetail.vue")
  },
  {
    path: "/major/detail/:id",
    name: "majorDetail",
    component: () => import("../views/MajorDetail.vue")
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue")
  }
];


const router = new VueRouter({
  routes,
});

export default router;
