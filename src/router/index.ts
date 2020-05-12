import Vue from 'vue';
import VueRouter, { RouteConfig, Route } from 'vue-router';
import installRouterGuards from './installRouterGuards';
import CoreLayout from "@/components/CoreLayout.vue";
import Home from '../views/Home.vue';

Vue.use(VueRouter);

export interface Menu extends RouteConfig {
  icon: string;
  badgesKey?: string;
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
    icon: "message",
    name: "消息",
    path: "/message",
    badgesKey: "message",
    component: () => import("../views/Message.vue")
  },
  {
    icon: "person",
    name: "我的",
    path: "/person",
    component: () => import("../views/Person.vue")
  }
];

export const personMenu: Menu[] = [
  {
    icon: "bookmark_border",
    name: "我收藏的院校",
    path: "/followed/university",
    component: () => import("../views/FollowedUniversity.vue"),
    meta: {
      requireLogin: true
    }
  },
  {
    icon: "bookmark_border",
    name: "我收藏的专业",
    path: "/followed/major",
    component: () => import("../views/FollowedMajor.vue"),
    meta: {
      requireLogin: true
    }
  },
  {
    icon: "bookmark_border",
    name: "我收藏的文章",
    path: "/followed/article",
    meta: {
      requireLogin: true
    }
  },
  {
    icon: "insert_drive_file",
    name: "我的测评报告",
    path: "/evaluation/result",
    meta: {
      requireLogin: true
    }
  },
  {
    icon: "call",
    name: "联系客服",
    path: "/contactus",
    component: () => import("../views/ContactUs.vue")
  },
  {
    icon: "settings",
    name: "系统设置",
    path: "/systemSetting",
    component: () => import("../views/SystemSetting.vue"),
    meta: {
      requireLogin: true
    }
  }
]

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
    component: () => import("../views/IntelgenceChoice.vue"),
    meta: {
      requireLogin: true
    }
  }
];

export const routes = [
  {
    path: "/",
    redirect: "/home",
    component: CoreLayout,
    children: [
      bottomMenus[0],
      bottomMenus[1],
      bottomMenus[3]
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue")
  },
  {
    path: "/university/detail/:id",
    name: "universityDetail",
    component: () => import("../views/UniversityDetail.vue"),
    meta: {
      requireLogin: true
    }
  },
  {
    path: "/major/detail/:id",
    name: "majorDetail",
    component: () => import("../views/MajorDetail.vue"),
    meta: {
      requireLogin: true
    }
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue")
  },
  {
    path: "/password/reset",
    name: "密码设置",
    component: () => import("../views/PasswordReset.vue"),
    // meta: {
    //   requireLogin: true
    // }
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
  },
  {
    path: "/",
    component: () => import("@/components/withHeaderBarLayout.vue"),
    children: [
      ...personMenu,
    ]
  },
  bottomMenus[2]
];


const router = new VueRouter({
  routes: [...routes, ...mainMenus] as RouteConfig[],
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
