<template>
  <v-container>
    <v-list>
      <v-list-item to="/password/reset">
        <v-list-item-avatar>
          <v-icon>settings</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>密码设置</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item @click="loginOut">
        <v-list-item-avatar>
          <v-icon>exit_to_app</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>退出登录</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { LOGIN_OUT } from "../store/actions";

@Component({
    name: "SystemSetting"
})
export default class extends Vue {
    private loginOut() {
        this.$store.dispatch(LOGIN_OUT);
        this.$router.push("/home");
    }
}
</script>