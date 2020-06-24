<style lang="less" scoped>
.btn-row {
    // background: transparent;
    // position: fixed;
    // bottom: 36px;
    // left: 0;
    // width: 100%;
    margin-top: 36px;
}
.modal-btn {
    width: 624px;
    height: 96px;
    background: url("/static/img/2.png") no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
}
.preview-img {
    display: block;
}
.result-container {
    min-height: 100vh;
    background: #f2f1f1;
}
</style>

<template>
  <div class="result-container">
    <!-- <header-bar :title="title"></header-bar>
    <v-divider></v-divider> -->
    <component ref="container" :is="currentComponent"></component>
    <v-row no-gutters class="btn-row">
      <v-col class="px-0">
        <div @click="generateImages" class="modal-btn"></div>
      </v-col>
    </v-row>
    <v-dialog v-model="shouldShowDialog">
        <img class="preview-img" :src="imgUrl" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { VueConstructor } from "vue";
import Interesting from "@/views/evaluationResults/Interesting.vue";
import Personality from "@/views/evaluationResults/Personality.vue";
import Specialty from "@/views/evaluationResults/Specialty.vue";
import Creativity from "@/views/evaluationResults/Creativity.vue";
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

    private imgUrl: string = "";
    private shouldShowDialog: boolean = false;

    get title(): string {
        return Title[parseInt(this.$route.params.id, 10)];
    }

    get currentComponent() {
        const componentMap: Dict<VueConstructor> = {
            1: Interesting,
            2: Personality,
            4: Specialty,
            3: Creativity
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