<style lang="less">
body,
html,
div,
button,
span,
p {
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

.v-text-field--box .v-input__slot,
.v-text-field--outline .v-input__slot {
    min-height: auto !important;
}

// html, body, #app {
//   height: 100%;
// }
</style>

<template>
  <v-app v-touch="{up: onTouchUp}">
    <v-content>
      <router-view></router-view>
    </v-content>
    <div class="justify-center loader-content custom-v-dialog" v-show="shoudShowLoading">
      <v-progress-circular indeterminate color="primary" class="mb-0"></v-progress-circular>
    </div>
    <v-snackbar :value="shouldShowAppErrorMsg">
      {{ appErrorMsg }}
      <v-btn color="pink" text @click="closeErrorMsg" icon>
          <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { AppState, WxShareConfig } from "@/store/app-state";
import crypto from "crypto-js";
import { AxiosResponse } from "axios";
import eventBus from "./event-bus";
import { SET_WX_SHARE_CONFIG, APP_ERROR_MESSAGE_STATUS } from "@/store/mutation-types";
export default Vue.extend({
    name: "App",

    components: {
        // HelloWorld,
        // navBar
    },
    computed: {
        appState(): AppState {
            return this.$store.state.appState;
        },
        shoudShowLoading() {
            return this.$store.getters.isPendingRequestExist;
        },
        wxConfig(): WxShareConfig {
            return this.$store.state.appState.wxShareConfig;
        },
        shouldShowAppErrorMsg() {
            return this.$store.state.appState.shouldShowErrorMsg;
        },
        appErrorMsg() {
            return this.$store.state.appState.appErrorMsg;
        }
    },
    methods: {
        closeErrorMsg() {
            this.$store.commit(APP_ERROR_MESSAGE_STATUS, false)
        },
        async getWxAccessToken() {
            const rsp: AxiosResponse<{
                access_token: string;
                expires_in: number;
            }> = await this.$http.get(`/wx/cgi-bin/token`, {
                params: {
                    grant_type: "client_credential",
                    appid: "wx922d0b00cb4edb33",
                    secret: "4c46263f95ea8cf91906d5ac3953a060"
                }
            });

            return rsp.data;
        },
        async getJsApiTicket(accessToken: string) {
            const rsp: AxiosResponse<{
                ticket: string;
                expires_in: number;
            }> = await this.$http.get("/wx/cgi-bin/ticket/getticket", {
                params: {
                    access_token: accessToken,
                    type: "jsapi"
                }
            });

            return rsp.data;
        },

        onTouchUp() {
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
            const scrollY = window.scrollY;
            if (scrollHeight - clientHeight <= scrollY) {
                eventBus.$emit("bottomTouchUp");
            }
        },

        generateSignature(ticket: string) {
            const url = location.href;
            const nonceStr = "kwtiftg";
            const timestamp = new Date().valueOf();
            const string1 = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;
            const hash = crypto.SHA1(string1);
            const signature = hash.toString(crypto.enc.Hex);
            this.$store.commit(SET_WX_SHARE_CONFIG, {
                timestamp,
                nonceStr,
                signature
            });
        },
        initWxConfig() {
            const { wxConfig } = this;
            wx.config({
                debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: wxConfig.appId, // 必填，公众号的唯一标识
                timestamp: wxConfig.timestamp, // 必填，生成签名的时间戳，与生成签名的timestamp要一致
                nonceStr: wxConfig.nonceStr, // 必填，生成签名的随机串，与生成签名的nonceStr要一致
                signature: wxConfig.signature, // 必填，签名
                jsApiList: ["updateAppMessageShareData"] // 必填，需要使用的JS接口列表
            });
        }
    },
    async mounted() {
        // const { access_token } = await this.getWxAccessToken();
        // const { ticket } = await this.getJsApiTicket(access_token);
        // this.generateSignature(ticket);
        // this.initWxConfig();
        // wx.error(function(res: any) {
        //     // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        // });
        // this.goShare();
    }
});
</script>
