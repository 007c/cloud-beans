<template>
  <v-btn @click="gotoMessage" color="primary" small text>专家咨询</v-btn>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
@Component({
    name: "AdvisoryBtn"
})
export default class extends Vue {
    @Prop({ required: true }) private typeCode!: number;
    get messageTemplate(): Dict<string> {
        return this.$store.getters.messageTemplate;
    }
    private gotoMessage() {
        this.$emit("click");
        const messageTemplate = this.messageTemplate[this.typeCode];
        this.$router.push({
            path: "/message",
            query: {
                typeCode: this.typeCode.toString(),
                template: messageTemplate
            }
        });
    }
}
</script>