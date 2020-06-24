<style lang="less" src="./index.less" scoped>
</style>

<style lang="less" scoped>
.desc-panel {
    width: 597px;
    height: 186px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &.bottom {
        margin-top: 38px;
    }
    .header {
        height: 29%;
        font-size: 30px;
        line-height: 48px;
        color: #000000;
        font-family: "F ZZ DH JW";
    }
    .content {
        height: 100%;
        font-size: 26px;
        line-height: 36px;
        color: #000000;
        padding: 0 32px;
        font-weight: bold;
    }
}
.qr-code {
    margin-left: 56px;
}
.describe-text {
    &.small {
        font-size: 44px;
        color: #ff9307;
    }
    font-size: 36px;
    line-height: 72px;
    color: #6eb2b9;
    text-align: center;
    margin-top: 45px;
    > .bigger {
        font-size: 60px;
    }
}
.with-jack-horse {
    display: flex;
    align-items: center;
    padding-left: 28px;
    margin-top: 72px;
}
.jack-horse-container {
    width: 302px;
    height: 339px;
}
.numbers-container {
    font-size: 114px;
    color: #ff9307;
    font-weight: bold;
    line-height: 1.2em;
}
.vertical-text {
    font-size: 35px;
    letter-spacing: -3px;
    line-height: 35px;
    color: #6eb2b9;
    writing-mode: tb;
    float: right;
    margin-top: 6%;
}
.triangle {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 26px 26.5px 0 26.5px;
    border-color: #000000 transparent transparent transparent;
    margin: 0 auto;
    margin-top: 29px;
}
</style>

<template>
  <v-container class="container pa-0 pb-1">
    <div class="evaluations-title img-container">
      <img src="/static/img/title_creativity.png" class="img" alt />
      <img class="avatar-img" :src="userInfo.avatar" />
    </div>
    <!-- <canvas ref="chartContainer" class="chart-container"></canvas> -->
    <h2 class="describe-text">
      <span class="bigger">您 </span>
      与马云在这一神秘属性上具有
    </h2>

    <section class="with-jack-horse">
      <div class="jack-horse-container img-container">
        <img class="img" src="/static/img/jack_horse.png" alt />
      </div>
      <div class="numbers-container">
        <div>
          {{data[0].answerDescribe.split("|")[0]}}
          <span class="vertical-text">相似度</span>
        </div>
        <div>创造力</div>
      </div>
    </section>

    <h2 class="describe-text small">人才最本质的特点在于创造</h2>

    <div class="triangle"></div>
    <div v-if="data.length !== 0">
      <section class="img-container desc-panel bottom">
        <img class="img" src="/static/img/border.png" alt />
        <div
          class="content d-flex justify-center align-center"
        >{{data[0].answerDescribe.split("|")[1]}}</div>
      </section>
    </div>
    <footer class="page-footer">
      <div class="qr-code img-container">
        <img class="img" src="/static/img/界面(1)(1)_14.png" alt />
      </div>
      <div class="desc-text">
        <div>志愿|专家|未来</div>
        <div>扫一扫/免费获取你的专属报告</div>
        <div>更多咨询|关注“前途问路”公众号</div>
      </div>
    </footer>
  </v-container>
</template>
<script lang="ts">
const ALL_TYPES = ["研究型", "艺术型", "社会型", "企业型", "传统型", "现实型"];

import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import F2 from "@antv/f2";
import { Option } from "../evaluations/Intertesting.vue";
import { toCanvas } from "../../util/htmlToCanvas";
import { UserInfo } from "../../store/use-state";
import RadarChart, { RadarChartData } from "./RadarChart.vue";
const MAX_ANWSER_COUNT = 3;
@Component({
    components: {
        RadarChart
    }
})
export default class extends Vue {
    private data: Option[] = [];

    private chartData: RadarChartData[] = [];

    private answerLabels: string[] = [];

    private interestings: string[] = [];

    private created() {
        this.getEvaluations();
    }

    get anwserDesc(): string {
        return this.data
            .slice(0, 3)
            .map(
                (item) => item.answer.split("-")[1] || item.answer.split("-")[0]
            )
            .join("+");
    }

    private onDataLoaded() {
        this.genChartData();
    }

    private async getEvaluations() {
        const rsp = await this.$http.get<ResponseModel<any>>(
            "/api/Tests/GetUserTest2Answer",
            {
                params: {
                    testid: this.$route.params.id
                }
            }
        );

        this.data = rsp.data.data;
        this.onDataLoaded();
    }

    private genChartData() {
        const maxLevels = this.data[0].levels;
        const data: RadarChartData[] = this.data.map(
            (item, index): RadarChartData => {
                return {
                    label: item.answerDescribe?.split("|")[0],
                    weight: item.levels / maxLevels
                };
            }
        );
        this.chartData = data;
    }

    get userInfo(): UserInfo {
        return this.$store.state.userState.userInfo;
    }
}
</script>