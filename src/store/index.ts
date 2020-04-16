import Vue from 'vue';
import Vuex from 'vuex';
import appState, { AppState } from "./app-state";
import userState, { UserState } from "./use-state";
import cacheDataState, { CacheDataState } from "./cache-data";
Vue.use(Vuex);

interface RootState {
  appState: AppState,
  userState: UserState,
  cacheDataState: CacheDataState
}


export default new Vuex.Store<RootState>({
  mutations: {
  },
  actions: {
  },
  modules: {
    appState,
    userState,
    cacheDataState
  },
});
