declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
declare module 'vuetify/lib' {
  import 'vuetify/types/lib'
}

declare module 'vuetify/es5/locale/zh-Hans' {
  import 'vuetify/es5/locale/zh-Hans'
}

declare const wx: any;