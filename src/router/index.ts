import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);


export const routes = [
  {
    path: '/',
    name: 'Home',
    // component: Layout,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];


interface Menu {
  icon?: string;
  name: string;
  path: string;
}

export const menus: Menu[] = [
  {
    icon: "search",
    name: "查询",
    path: "/about"
  },
  {
    icon: "more_horiz",
    name: "详情",
    path: "/detail"
  },
]

const router = new VueRouter({
  routes,
});

export default router;
