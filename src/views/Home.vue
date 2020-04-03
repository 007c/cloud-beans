<style lang="less" scoped>
.carousel-img {
    width: 100%;
    height: 100%;
}
</style>
<style lang="less">
.v-bottom-navigation.no-shadow {
    box-shadow: none;
}
</style>
<template>
  <v-container class="pa-0">
    <v-row no-gutters class="mt-2 mb-4" col="12">
      <v-col class="pl-6 pr-6">
        <v-text-field
          height="15px"
          hide-details
          readonly
          @click="$router.push('/search')"
          dense
          outlined
          append-icon="search"
          placeholder="去搜索"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-carousel cycle height="150" hide-delimiter-background show-arrows-on-hover>
        <v-carousel-item v-for="(slide, i) in prompts" :key="i">
          <v-sheet height="100%">
            <router-link :to="slide.link">
              <img :src="slide.imgUrl" class="carousel-img" />
            </router-link>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
    </v-row>
    <v-row no-gutters class="justify-center mt-2 mr-4 ml-4">
      <v-col cols="3">
        <v-btn color="grey" width="100%" text>
          <v-icon>location_on</v-icon>
          <span>四川</span>
        </v-btn>
      </v-col>
      <v-col cols="3">
        <v-btn color="grey" width="100%" text>
          <v-icon>subject</v-icon>
          <span>理科</span>
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn color="grey" width="100%" text>
          <v-icon>book</v-icon>502
        </v-btn>
      </v-col>
    </v-row>
    <v-row no-gutters class="mt-4">
      <v-col v-for="menu in mainMenus" :key="menu.path">
        <v-card flat class="justify-center d-flex flex-column align-center">
          <v-btn color="primary" depressed small :to="menu.path" fab>
            <v-icon small>{{menu.icon}}</v-icon>
          </v-btn>
          <span class="caption pa-0 mt-3 grey--text text--lighten-1">{{menu.name}}</span>
        </v-card>
      </v-col>
    </v-row>
    <v-divider class="mt-4"></v-divider>
    <v-row class="mt-1" no-gutters>
      <v-col class="pl-2" cols="1">
        <v-icon>volume_up</v-icon>
      </v-col>
      <v-col class="pl-3">
        <v-carousel height="30px" hide-delimiters cycle vertical :show-arrows="false">
          <v-carousel-item v-for="item in prompts" :key="item.link">
            <router-link :to="item.link">
              <span class="grey--text subtitle-2">{{item.title}}</span>
            </router-link>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
    <v-divider></v-divider>

    <v-list class="pb-8">
      <v-subheader>高考课堂</v-subheader>

      <template v-for="(item, index) in classess">
        <v-list-item :key="index">
          <v-img class="mr-2" height="100%" max-width="60px" :src="item.imgUrl"></v-img>
          <v-list-item-content>
            <v-list-item-title class="subtitle-1">{{item.title}}</v-list-item-title>
            <v-list-item-subtitle>
              <span class="mr-1">04-01</span>
              <span class="mr-1">14:00:01</span>
              <span class="ml-4 mr-4">文章</span>
              <span>1027浏览</span>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="index"></v-divider>
      </template>
    </v-list>   
    <v-bottom-navigation
      :input-value="!shoudHideNav"
      horizontal
      fixed
      color="primary text--lighten-1 d-flex align-center"
    >
      <v-btn
        class="body-1"
        large
        v-for="menu in menus"
        :value="menu.name"
        :to="menu.path"
        :key="menu.path"
      >
        <span>{{menu.name}}</span>
        <v-icon class="mr-2" style="font-size: 1.5rem" v-if="menu.icon">{{menu.icon}}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

interface Slider {
    imgUrl: string;
}

interface Menu {
    icon?: string;
    name: string;
    path: string;
}

import { Prompt, prompts } from "./prompts";
import { ClassItem, classess } from "./classess";
import { createDebounce } from "@/util";
const menus: Menu[] = [
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
];

const mainMenus: Menu[] = [
    {
        icon: "school",
        name: "院校查询",
        path: "/university/query"
    },
    {
        icon: "search",
        name: "专业查询",
        path: "/major/query"
    },
    {
        icon: "touch_app",
        name: "职业测评",
        path: "/evaluation"
    },
    {
        icon: "flight_takeoff",
        name: "智能择校",
        path: "/choice"
    }
];

@Component({
    name: "Home"
})
export default class extends Vue {
    private menus = menus;
    private mainMenus = mainMenus;
    private slides: Slider[] = [];
    private prompts: Prompt[] = prompts;
    private classess: ClassItem[] = classess;
    private shoudHideNav: boolean = false;
    private scrollY: number = 0;
    private scrollDirection: "up" | "down" = "up";
    private mounted() {
        this.scrollY = window.scrollY;
        this.updateShare();
        const scrollHandler = () => {
            if (window.scrollY - this.scrollY <= 0) {
                this.shoudHideNav = false;
            } else {
                this.shoudHideNav = true;
            }
            this.scrollY = window.scrollY;
        };

        window.addEventListener("scroll", scrollHandler);
    }

    private updateShare() {
        wx.ready(function() {
            const title = "哈哈哈啊哈哈";
            const desc = "分享描述";
            const imgUrl = "https://img95.699pic.com/photo/40006/9851.jpg_wh860.jpg";
            const url = location.href;
            wx.updateAppMessageShareData({
                title, // 分享标题
                desc, // 分享描述
                link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl, // 分享图标
                success() {
                    // 设置成功
                }
            });
        });
    }
}
</script>