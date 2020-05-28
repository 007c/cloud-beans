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
  <v-container>
    <v-row no-gutters class="mt-2 mb-4" col="12">
      <v-col class="align-center d-flex justify-center" cols="2">
        <h2 class="justify-center d-flex align-center subtitle-1 grey--text">首页</h2>
      </v-col>
      <v-col class="pl-3">
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
    <student-info-bar></student-info-bar>
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
        <v-icon color="secondary">volume_up</v-icon>
      </v-col>
      <v-col class="pl-3">
        <v-carousel height="30px" hide-delimiters cycle vertical :show-arrows="false">
          <v-carousel-item v-for="item in prompts" :key="item.pubMsg">
            <router-link :to="item.link">
              <span class="grey--text subtitle-2">{{item.title}}</span>
            </router-link>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
    <v-divider></v-divider>

    <v-list class="pb-8">
      <v-subheader class="justify-space-between">
        高考课堂
        <router-link class="float-right" to="/classes">>></router-link>
      </v-subheader>

      <template v-for="(item, index) in classes">
        <v-list-item :key="index" @click="goClasses(index)">
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
        <v-divider :key="item.path"></v-divider>
      </template>
    </v-list>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

interface Slider {
    imgUrl: string;
}

import { Prompt, prompts } from "./prompts";
import { ClassItem, classes } from "./classes";
import { createDebounce } from "@/util";
import { mainMenus } from "@/router";
import StudentInfoBar from "@/components/StudentInfoBar.vue";

let scrollHandler: () => void;

@Component({
    name: "Home",
    components: {
        StudentInfoBar
    }
})
export default class extends Vue {
    private mainMenus = mainMenus;
    private slides: Slider[] = [];
    private prompts: Prompt[] = [];
    private classes: ClassItem[] = classes;
    private shoudHideNav: boolean = false;
    private scrollY: number = 0;
    private scrollDirection: "up" | "down" = "up";
    private created() {
        this.getPrompts();
    }
    private mounted() {
        this.scrollY = window.scrollY;
        // this.updateShare();
        scrollHandler = () => {
            if (window.scrollY - this.scrollY <= 0) {
                this.shoudHideNav = false;
            } else {
                this.shoudHideNav = true;
            }
            this.scrollY = window.scrollY;
        };

        window.addEventListener("scroll", scrollHandler);
        if (process.env.NODE_ENV !== "production") {
            // this.listUsers();
        }
    }

    private async listUsers() {
        const rsp = await this.$http.get("/api/Users/GetUsers");
    }

    private goClasses(id: number) {
        this.$router.push(`/class/${id}`);
    }

    private beforeDestroy() {
        window.removeEventListener("scroll", scrollHandler);
    }

    private async getPrompts() {
        const rsp = await this.$http.get<
            ResponseModel<
                Array<{
                    busiTime: string;
                    createTime: string;
                    id: string;
                    pubMsg: string;
                    pubState: number;
                    pubType: number;
                    showLevels: number;
                }>
            >
        >("/api/Pubs/GetPubsList");

        const data = rsp.data.data;

        this.prompts = data.map(
            (item): Prompt => {
                return {
                    title: item.pubMsg,
                    link: "/prompt"
                };
            }
        );
    }

    private updateShare() {
        wx.ready(function() {
            const title = "哈哈哈啊哈哈";
            const desc = "分享描述";
            const imgUrl =
                "https://img95.699pic.com/photo/40006/9851.jpg_wh860.jpg";
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