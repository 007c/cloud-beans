<template>
  <v-container class="pa-0">
    <router-view></router-view>
    <v-bottom-navigation
      app
      height="auto"
      grow
      :input-value="!shoudHideNav"
      horizontal
      fixed
      color="primary text--lighten-1 d-flex align-center"
    >
      <v-btn class="body-1 py-4" v-for="menu in menus" :to="menu.path" :key="menu.path">
        <v-badge v-if="shouldShowBadges(menu)" color="red" :content="badges[menu.badgesKey]">
          <span>{{menu.name}}</span>
        </v-badge>
        <span v-else>{{menu.name}}</span>
        <v-icon class="mr-2" style="font-size: 1.5rem" v-if="menu.icon">{{menu.icon}}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import { bottomMenus, Menu } from "../router";
let scrollHandler: () => void;

@Component({
    name: "CoreLayout"
})
export default class extends Vue {
    private menus = bottomMenus;
    private shoudHideNav: boolean = false;
    private scrollY: number = 0;
    private badges: Dict<number> = {
        message: 0
    };

    get isLogin() {
        return this.$store.getters.isLogin;
    }

    private created() {
        if (this.isLogin) {
            this.getUnReadMessageCount();
        }
    }

    private async getUnReadMessageCount() {
        const rsp = await this.$http.get<ResponseModel<string>>(
            "/api/Messages/GetCount"
        );
        const data = JSON.parse(rsp.data.data);
        this.badges.message = data.notread;
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
        this.badges.message = 5;
    }

    private beforeDestroy() {
        window.removeEventListener("scroll", scrollHandler);
    }

    private shouldShowBadges(menu: Menu): boolean {
        return (
            menu.badgesKey !== undefined &&
            this.badges[menu.badgesKey] !== 0 &&
            this.isLogin
        );
    }
}
</script>
