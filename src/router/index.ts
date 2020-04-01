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


interface Menu {
  icon?: string;
  name: string;
  path: string;
}

export const menus: Menu[] = [
  {
    icon: "home",
    name: "首页",
    path: "/home"
  },
  {
    icon: "class",
    name: "课堂",
    path: "/class"
  },
  {
    icon: "person",
    name: "我的",
    path: "/person"
  }
]

const router = new VueRouter({
  routes,
});

export default router;
