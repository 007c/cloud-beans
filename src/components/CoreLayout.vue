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
      <v-btn class="body-1 pt-3 pb-3" v-for="menu in menus" :to="menu.path" :key="menu.path">
        <span>{{menu.name}}</span>
        <v-icon class="mr-2" style="font-size: 1.5rem" v-if="menu.icon">{{menu.icon}}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import { bottomMenus } from "@/router";

let scrollHandler: () => void;

@Component({
    name: "CoreLayout"
})
export default class extends Vue {
    private menus = bottomMenus;
    private shoudHideNav: boolean = false;
    private scrollY: number = 0;
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
    }

    private beforeDestroy() {
        window.removeEventListener("scroll", scrollHandler);
    }
}
</script>
