import Vue, { PluginFunction } from "vue";
import { VueConstructor } from 'vue/types/umd';
import HeaderBar from "./HeaderBar.vue";

const plugin: PluginFunction<any> = function(vue: VueConstructor) {
    vue.component("HeaderBar", HeaderBar);
}

Vue.use(plugin);

