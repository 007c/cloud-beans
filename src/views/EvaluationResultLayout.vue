<style lang="less" scoped>
.btn-row {
    background: transparent;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
}
</style>

<template>
  <div >
    <!-- <header-bar :title="title"></header-bar>
    <v-divider></v-divider> -->
    <component ref="container" :data="evaluations" :is="currentComponent"></component>
    <v-row no-gutters class="px-4 btn-row">
      <v-col>
        <v-btn @click="generateImages" block color="primary" class="mb-2 mt-2">生成测试报告</v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="shouldShowDialog">
        <img :src="imgUrl" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { VueConstructor } from "vue";
import Interesting from "@/views/evaluationResults/Interesting.vue";
import { toCanvas } from "../util/htmlToCanvas";

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

    private imgUrl: string = "";
    private shouldShowDialog: boolean = false;

    private created() {
        this.getEvaluations();
    }

    private async getEvaluations() {
        const rsp = await this.$http.get<ResponseModel<any>>(
            "/api/Tests/GetUserTest1Result",
            {
                params: {
                    testid: this.$route.params.id
                }
            }
        );

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

    private generateImages() {
        const container = this.$refs.container as any;
        toCanvas(container.$el, []).then((canvas) => {
            this.imgUrl = canvas.toDataURL("image/png", 1.0);
            this.shouldShowDialog = true;
        });
    }
}
</script>