<style lang="less">
body,
html,
div,
button,
span {
    padding: 0;
    margin: 0;
}
</style>

<template>
  <v-app>
    <v-bottom-navigation absolute horizontal color="primary">
      <v-btn
        :x-small="true"
        v-for="menu in menus"
        :value="menu.name"
        :to="menu.path"
        :key="menu.path"
      >
        <span>{{menu.name}}</span>
        <v-icon v-if="menu.icon">{{menu.icon}}</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <v-content fluid class="fill-height"></v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import HelloWorld from "./components/HelloWorld.vue";
import navBar from "./components/nav.vue";
import { menus } from "./router";

export default Vue.extend({
    name: "App",

    components: {
        HelloWorld,
        navBar
    },

    data: () => ({
        menus
    })
});
</script>
