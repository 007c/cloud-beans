import Vue, { PluginFunction } from "vue";
import { VueConstructor } from 'vue/types/umd';
import HeaderBar from "./HeaderBar.vue";
import AdvisoryBtn from "./AdvisoryBtn.vue";
import { Prop } from 'vue/types/options';

const plugin: PluginFunction<any> = function (vue: VueConstructor) {
    vue.component("HeaderBar", HeaderBar);
    vue.component("AdvisoryBtn", AdvisoryBtn);
}

Vue.use(plugin);

