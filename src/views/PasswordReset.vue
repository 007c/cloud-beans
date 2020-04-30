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
        <h1 class="headline blue--text text-lighten-5 font-weight-regular text-center">重设密码</h1>
      </v-col>
    </v-row>
    <v-form ref="registerForm">
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
        <v-col col="12" style="position:relative">
          <v-text-field
            validate-on-blur
            :rules="[validateCheckCode]"
            v-model="validateCode"
            type="phone"
            label="验证码"
            :hint="hintText"
          ></v-text-field>
          <v-btn
            :disabled="remainTime !== 0 || !isPhoneNumber(phoneNumber)"
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
          <v-btn @click="register" block color="primary">重置密码</v-btn>
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
import { UPDATE_APP_MESSAGE } from "../store/mutation-types";
let remainTimeTimer: number | undefined;
@Component({
    name: "Login"
})
export default class extends Vue {
    private phoneNumber: string = "";
    private validateCode: string = "";
    private remainTime: number = 0;
    private password: string = "";
    private repeatPassword: string = "";
    private validateCodeNum: string = "";
    private hintText: string = "请先获取验证码";
    @withLoading()
    private async register() {
        const form: any = this.$refs.registerForm;
        const validateRet = form.validate();
        if (!validateRet) {
            return;
        }

        try {
            await this.$http.put("/api/Users/SetPwdByCheckCode", {
                mobile: this.phoneNumber,
                newpwd: this.password,
                checkCode: this.validateCode,
                num: parseInt(this.validateCodeNum, 10)
            });

            this.$store.commit(UPDATE_APP_MESSAGE, {
                msg: "重置成功，请重新登录",
                type: "info",
                position: "top",
                timeout: 3000
            });

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

    private async getValidateCode() {
        const { data } = await this.$http.get<ResponseModel<string>>(
            "/api/Users/GetChangePwdCheckCode",
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
