<template>
  <v-btn class="pa-0" @click.stop="gotoMessage" color="primary" small text>
    <v-icon class="mr-1 align-top" size="small">textsms</v-icon>专家咨询
  </v-btn>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { startAsyncGuide } from "../loginGuideController";
@Component({
    name: "AdvisoryBtn"
})
export default class extends Vue {
    @Prop({ required: true }) private typeCode!: number;
    @Prop({ default: "" }) private postfix!: string;
    get messageTemplate(): Dict<string> {
        return this.$store.getters.messageTemplate;
    }
    get isLogin() {
        return this.$store.getters.isLogin;
    }
    private gotoMessage() {
        this.$emit("click");
        const messageTemplate = this.messageTemplate[this.typeCode];
        if (!this.isLogin) {
            return startAsyncGuide().then(() => {
                this.$router.push({
                    path: "/login",
                    query: {
                        redirect: this.$route.fullPath
                    }
                });
            });
        }
        this.$router.push({
            path: "/message",
            query: {
                typeCode: this.typeCode.toString(),
                template: messageTemplate + " " + this.postfix
            }
        });
    }
}
</script>