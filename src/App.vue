<style lang="less">
body,
html,
div,
button,
span {
    padding: 0;
    margin: 0;
}
.custom-v-dialog.loader-content {
  background: transparent;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  top: 0;
  left: 0;
  align-items: center;
}
</style>

<template>
  <v-app>
    <v-content>
      <router-view></router-view>
    </v-content>
    <div class="justify-center loader-content custom-v-dialog" v-show="shoudShowLoading">
      <v-progress-circular indeterminate color="primary" class="mb-0"></v-progress-circular>
    </div>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { AppState } from "@/store/app-state";
export default Vue.extend({
    name: "App",

    components: {
        // HelloWorld,
        //navBar
    },
    computed: {
        appState(): AppState {
            return this.$store.state.appState;
        },
        shoudShowLoading() {
            return this.$store.getters.isPendingRequestExist;
        }
    },
    mounted() {
        console.log(this.shoudShowLoading);
    }
});
</script>
