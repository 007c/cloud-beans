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
  <v-container>
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
      <v-row v-show="loginType === 1">
        <v-col col="12">
          <v-text-field
            validate-on-blur
            v-model="password"
            type="password"
            :rules="[validatePassword]"
            label="密码"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row v-show="loginType === 2">
        <v-col col="12" style="position:relative">
          <v-text-field
            v-model="validateCode"
            type="phone"
            label="验证码"
            :hint="hintText"
            validate-on-blur
            :rules="[validateCheckCode]"
          ></v-text-field>
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
      <v-row class="justify-end mt-n6" no-gutters>
        <v-btn v-if="loginType===1" @click="loginType=2" text color="primary">验证码登录</v-btn>
        <v-btn v-if="loginType===2" @click="loginType=1" text color="primary">密码登录</v-btn>
      </v-row>
      <v-row>
        <v-col>
          <v-btn @click="login" block color="primary">登录</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn @click="$router.push('/register')" block outlined color="secondary">注册</v-btn>
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
import {
    SET_USER_TOKEN,
    UPDATE_USER_INFO,
    UPDATE_APP_MESSAGE
} from "@/store/mutation-types";
import { UserInfo } from "@/store/use-state";
import { AxiosResponse } from "axios";
let remainTimeTimer: number | undefined;
@Component({
    name: "Login"
})
export default class extends Vue {
    private phoneNumber: string = "";
    private validateCode: string = "";
    private remainTime: number = 0;
    private password: string = "";
    private hintText: string = "请先获取验证码"
    // 用户登录【可用】 1手机号+密码(可用) 2手机号+验证码登录
    private loginType: 1 | 2 = 1;
    @withLoading()
    private async login() {
        const loginForm: any = this.$refs.loginForm;
        const validateRet = loginForm.validate();
        if (!validateRet) {
            return;
        }

        try {
            let rspData: AxiosResponse<ResponseModel<string>>;

            // { data } = await this.loginByPassword();
            if (this.loginType === 1) {
                rspData = await this.loginByPassword();
            } else {
                rspData = await this.loginByValidateCode();
            }

            const { data } = rspData;
            const userToken = data.data;

            localStorage.setItem("user_token", userToken);

            this.$store.commit(SET_USER_TOKEN, userToken);
            // this.$store.commit(UPDATE_USER_INFO, userInfo);
            localStorage.setItem(
                "expired_at",
                (+new Date() + 60 * 1000 * 60).toString()
            );
            const toPath = (this.$route.query.redirect as string) || "/home";
            this.$router.push(toPath);
        } catch (ex) {
            this.$store.commit(UPDATE_APP_MESSAGE, {
                msg: "账号或密码错误，请检查！",
                timeout: 5000,
                color: "info",
                position: "top"
            });
        }
    }

    private async loginByValidateCode() {
        return this.$http.post<ResponseModel<string>>(
            "/api/Values/LoginByPwd",
            {
                mobile: this.phoneNumber,
                checkCode: this.validateCheckCode,
            }
        )
    }

    private async loginByPassword() {
        return this.$http.post<ResponseModel<string>>(
            "/api/Values/LoginByPwd",
            {
                mobile: this.phoneNumber,
                pwd: this.password,
            }
        );
    }

    private validatePassword(password: string) {
        if (this.loginType === 2) {
            return true;
        }
        return password.trim().length >= 6 || "请输入至少6位密码";
    }

    private validateCheckCode(code: string) {
        if (this.loginType === 1) {
            return true;
        }

        return code.trim() !== "" || "请输入验证码";
    }

    private async getValidateCode() {
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
    private validatePhoneNumber(phoneNumber: string) {
        return /^1[3456789]\d{9}$/.test(phoneNumber) || "请输入正确的手机号码";
    }
}
</script>
