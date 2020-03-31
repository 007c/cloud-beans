import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import zhHans from 'vuetify/es5/locale/zh-Hans'
// import '@fortawesome/fontawesome-free/css/all.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
//import 'font-awesome/css/font-awesome.min.css'


Vue.use(Vuetify);

export default new Vuetify({
    lang: {
        locales: { zhHans },
        current: 'zhHans',
    },
    icons: {
        iconfont: "md"
    }
})
