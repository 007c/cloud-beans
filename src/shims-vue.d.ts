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

interface SelectOption<T> {
  text: string;
  value: T;
}

interface AreaTree {
  label: string;
  value: number;
  code?: string;
  children?: AreaTree[];
}

declare interface ResponseModel<T> {
  state: number;
  msg: string | null;
  data: T;
}

declare interface Dict<T> {
  [prop: string]: T;
}

declare interface GradeInfoModel {
  divisionTypeID: number;
  divisionType: string;
  highSchoolID: number;
  id: string;
  logoUrl: string;
  mobile: string;
  provinceCode: number;
  rank: number;
  score: number;
  userID: string;
  year: number;
}
