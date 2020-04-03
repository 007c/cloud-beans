import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

export interface Menu extends RouteConfig {
  icon: string;
}

export const bottomMenus: Menu[] = [
  {
    icon: "home",
    path: '/home',
    name: '首页',
    component: () => import("../views/Home.vue"),
  },
  {
      icon: "class",
      name: "课堂",
      path: "/class/:id?",
      component: () => import("../views/ClassView.vue")
  },
  {
      icon: "person",
      name: "我的",
      path: "/person",
      component: () => import("../views/Person.vue")
  }
];

export const mainMenus: Menu[] = [
  {
      icon: "school",
      name: "院校查询",
      path: "/university/query",
      component: () => import("../views/UniversitySearch.vue")
  },
  {
      icon: "search",
      name: "专业查询",
      path: "/major/query",
      component: () => import("../views/MajorSearch.vue")
  },
  {
      icon: "touch_app",
      name: "职业测评",
      path: "/evaluation",
      component: () => import("../views/Evaluation.vue")
  },
  {
      icon: "flight_takeoff",
      name: "智能择校",
      path: "/choice",
      component: () => import("../views/IntelgenceChoice.vue")
  }
];

export const routes = [
  {
    path: "/",
    redirect: "/home"
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
  }
];


const router = new VueRouter({
  routes: [...routes, ...bottomMenus, ...mainMenus],
});

export default router;
