<style lang="less" scoped>
.border-box {
    box-sizing: border-box;
}
.link {
    text-decoration: none;
}
</style>
<style lang="less">

.v-messages__wrapper > .v-messages__message {
  line-height: 1.2em;
}
</style>
<template>
  <v-container class="pa-6">
    <v-row class="md-5">
      <v-col>
        <h1 class="headline blue--text text-lighten-5 font-weight-regular text-center">手机登录</h1>
      </v-col>
    </v-row>
    <v-form ref="loginForm">
      <v-row>
        <v-col col="12">
          <v-text-field
            validate-on-blur
            v-model="phoneNumber"
            :rules="[validatePhoneNumber]"
            label="手机号"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col col="12" style="position:relative">
          <v-text-field v-model="validateCode" type="phone" label="验证码"></v-text-field>
          <v-btn
            :disabled="remainTime !== 0"
            class="mt-2"
            absolute
            small
            right
            top
            outlined
            color="primary"
            @click="getValidateCode"
          >
            <span v-if="remainTime === 0">获取验证码</span>
            <span v-if="remainTime !== 0">{{remainTime}}S后获取</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn @click="login" block color="primary">登录</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-row>
      <v-col class="pa-0">
        <p class="text-center caption">
          注：登录即表示同意
          <a
            class="link ml-1"
            href="https://www.baidu.com"
            color="primary"
          >&lt;&lt;高考APP用户协议&gt;&gt;</a>
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
interface Data {
    phoneNumber: string;
    validateCode: string;
    remainTime: number;
}

import { withLoading } from "@/decorators/with-loading";
import { Vue, Component, Prop } from "vue-property-decorator";
let remainTimeTimer: number | undefined = undefined;
@Component({
    name: "Login"
})
export default class extends Vue {
    phoneNumber: string = "";
    validateCode: string = "";
    remainTime: number = 0;
    @withLoading()
    async login() {
        const loginForm: any = this.$refs.loginForm;
        const validateRet = loginForm.validate()
        if (!validateRet) {
            return;
        }

        // await this.$http.post("/login", {
        //     phoneNumber: this.phoneNumber,
        //     validateCode: this.validateCode
        // });

        await new Promise((reslove, reject) => {
          setTimeout(() => {
            reslove();
          }, 2000);
        })

        this.$router.push("/home");
    }
    async getValidateCode() {
        clearInterval(remainTimeTimer);
        // await this.$http.get('/validateCode');
        this.remainTime = 60;
        remainTimeTimer = setInterval(() => {
            this.remainTime--;
            if (this.remainTime <= 0) {
                clearInterval(remainTimeTimer);
                this.remainTime = 0;
            }
        }, 1000);
    }
    validatePhoneNumber(phoneNumber: string) {
        return /^1[3456789]\d{9}$/.test(phoneNumber) || "请输入正确的手机号码";
    }
}
</script>
