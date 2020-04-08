import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { Touch } from 'vuetify/es5/directives'
import zhHans from 'vuetify/es5/locale/zh-Hans'
// import '@fortawesome/fontawesome-free/css/all.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
// import 'font-awesome/css/font-awesome.min.css'


Vue.use(Vuetify);

Vue.directive('touch', Touch);

export default new Vuetify({
    lang: {
        locales: { zhHans },
        current: 'zhHans',
    },
    icons: {
        iconfont: "md"
    },
    theme: {
        themes: {
            light: {
                secondary: '#9c27b0',
            },
        },
    },
})
