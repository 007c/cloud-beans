
<template>
    <v-container>
        <v-btn v-for="menu in menus" :value="menu.name" :to="menu.path" :key="menu.path">
        <v-icon v-if="menu.icon">{{menu.icon}}</v-icon>
        <span>{{menu.name}}</span>
        </v-btn>
    </v-container>
</template>


<script lang="tsx">
import Vue from "vue";
import { menus } from "../router";
export default Vue.extend({
    data() {
        return {
            routerName: "查询",
            menus
        };
    }
});
</script>