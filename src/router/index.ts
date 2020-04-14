import Vue from 'vue';
import VueRouter, { RouteConfig, Route } from 'vue-router';
import installRouterGuards from './installRouterGuards';
import CoreLayout from "@/components/CoreLayout.vue";
import Home from '../views/Home.vue';

Vue.use(VueRouter);

export interface Menu extends RouteConfig {
  icon: string;
}

export const bottomMenus: Menu[] = [
  {
    icon: "home",
    path: '/home',
    name: '首页',
    component: Home,
  },
  {
    icon: "class",
    name: "课堂",
    path: "/classes",
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

export const routes: RouteConfig[] = [
  {
    path: "/",
    redirect: "/home",
    component: CoreLayout,
    children: bottomMenus
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
  },
  {
    path: "/search",
    name: "Search",
    component: () => import("../views/Search.vue")
  },
  {
    path: "/grade/edit",
    name: "GradeEdit",
    component: () => import("../views/GradeEdit.vue"),
    meta: {
      requireLogin: true
    }
  },
  {
    path: "/class/:id",
    component: () => import("../views/ClassDetail.vue")
  },
  {
    path: "/prompt/:id?",
    component: () => import("../views/Prompt.vue")
  }
];


const router = new VueRouter({
  routes: [...routes, ...bottomMenus, ...mainMenus],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
});

installRouterGuards(router);

export default router;
