<template>
  <div class="pt-3">
    <header-bar :title="title"></header-bar>
    <v-divider></v-divider>
    <v-dialog :value="shouldShowLoginGuide">
      <v-card>
        <v-card-title class="subtitle-1 lighten-2">温馨提示</v-card-title>
        <v-divider></v-divider>
        <v-card-text v-if="dialogRemainTime>0" class="text-center mt-2 pa-0">
          <span class="title blue--text">{{dialogRemainTime}}</span>
        </v-card-text>
        <v-card-text class="pt-2">
          明白
          希望你仔细阅读题的陈述，我们将
          根据您的选项进行专业的分析。
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="isConfirmDisabled"
            color="primary"
            @click="shouldShowLoginGuide=false"
            text
          >明白</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <component :data="evaluations" :is="currentComponent"></component>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { VueConstructor } from "vue";
import Interesting from "@/views/evaluations/Intertesting.vue";

enum Title {
    "兴趣测试" = 1,
    "人格测试",
    "强项测试",
    "创造力测试"
}

let timerId: number;

@Component
export default class extends Vue {
    private dialogRemainTime = 3;
    private shouldShowLoginGuide = true;

    private evaluations: any = null;

    private created() {
        this.getEvaluations();
    }

    private mounted() {
        timerId = setInterval(() => {
            this.dialogRemainTime--;
            if (this.dialogRemainTime <= 0) {
                clearInterval(timerId);
            }
        }, 1000);
    }

    private async getEvaluations() {
        const rsp = await this.$http.get<ResponseModel<any>>("/api/Tests/GetTest1Options", {
            params: {
                testid: this.$route.params.id
            }
        });

        this.evaluations = rsp.data.data;
    }

    get isConfirmDisabled() {
        return false
    }

    get title(): string {
        return Title[parseInt(this.$route.params.id, 10)];
    }

    get currentComponent() {
        const componentMap: Dict<VueConstructor> = {
            1: Interesting
        };
        return componentMap[parseInt(this.$route.params.id, 10)] || Interesting;

    }
}
</script>