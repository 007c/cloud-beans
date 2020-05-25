<template>
  <div class="pt-3">
    <header-bar :title="title"></header-bar>
    <v-divider></v-divider>
    <component :data="evaluations" :is="currentComponent"></component>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { VueConstructor } from "vue";
import Interesting from "@/views/evaluationResults/Interesting.vue";

enum Title {
    "兴趣测试" = 1,
    "人格测试",
    "强项测试",
    "创造力测试"
}


@Component
export default class extends Vue {
    private shouldShowLoginGuide = true;

    private evaluations: any = null;

    private created() {
        this.getEvaluations();
    }

    private async getEvaluations() {
        const rsp = await this.$http.get<ResponseModel<any>>("/api/Tests/GetUserTest1Result", {
            params: {
                testid: this.$route.params.id
            }
        });

        this.evaluations = rsp.data.data;
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