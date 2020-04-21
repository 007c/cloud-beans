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
    <v-form ref="form">
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
        <v-col col="12">
          <v-text-field
            validate-on-blur
            v-model="oldPassword"
            :rules="[validatePassword]"
            type="password"
            label="旧密码"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col col="12">
          <v-text-field
            validate-on-blur
            v-model="password"
            :rules="[validatePassword]"
            type="password"
            label="新密码"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col col="12">
          <v-text-field
            validate-on-blur
            v-model="repeatPassword"
            type="password"
            :rules="[validateRepeatPassword]"
            label="确认密码"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn @click="resetPassword" block color="primary">确认修改</v-btn>
        </v-col>
      </v-row>
    </v-form>
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
import { UPDATE_APP_MESSAGE, SET_USER_TOKEN } from "../store/mutation-types";
import { LOGIN_OUT } from '../store/actions';
let remainTimeTimer: number | undefined;

@Component({
    name: "ResetPassword"
})
export default class extends Vue {
    private oldPassword: string = "";
    private phoneNumber: string = "";
    private validateCode: string = "999999";
    private remainTime: number = 0;
    private password: string = "";
    private repeatPassword: string = "";
    private validateCodeNum: string = "5";
    private hintText: string = "请先获取验证码";
    @withLoading()
    private async resetPassword() {
        const form: any = this.$refs.form;
        const validateRet = form.validate();
        if (!validateRet) {
            return;
        }

        try {
            await this.$http.put("/api/Users/SetPwdByOld", {
                mobile: this.phoneNumber,
                oldpwd: this.oldPassword,
                newpwd: this.password,
                checkCode: this.validateCode,
                num: this.validateCodeNum
            });
            this.$store.commit(UPDATE_APP_MESSAGE, {
                msg: "重设密码成功，请重新登录！",
                position: "top",
                color: "info",
                timeout: 3000
            });
            this.loginOut();
            this.$router.push("/login");
        } catch (ex) {
            const { data } = ex.response;
            if (data) {
                this.$store.commit(UPDATE_APP_MESSAGE, {
                    msg: ex.message,
                    position: "top",
                    color: "",
                    timeout: 3000
                });
            }
        }
    }

    private validateCheckCode(code: string) {
        return code.trim() !== "" || "请输入验证码";
    }

    private loginOut() {
      this.$store.dispatch(LOGIN_OUT);
    }

    private async getValidateCode() {
        const { data } = await this.$http.get<ResponseModel<string>>(
            "/api/Users/GetRegisterCheckCode",
            {
                params: {
                    mobile: this.phoneNumber
                }
            }
        );

        this.validateCodeNum = data.data;

        this.hintText = `请输入序号为【${data.data}】的验证码`;

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

    private isPhoneNumber(phoneNumber: string) {
        return /^1[3456789]\d{9}$/.test(phoneNumber);
    }

    private validatePhoneNumber(phoneNumber: string) {
        return this.isPhoneNumber(phoneNumber) || "请输入正确的手机号码";
    }

    private validatePassword(password: string) {
        return password.trim().length >= 6 || "请输入至少6位密码";
    }

    private validateRepeatPassword(repeatPassword: string) {
        return repeatPassword === this.password || "确认密码与密码不一致";
    }
}
</script>
