<style lang="less" src="./index.less" scoped>
</style>

<template>
  <v-container class="container pa-0 pb-1">
    <div class="evaluations-title img-container">
      <img src="/static/img/界面(1)(1)_03.png" class="img" alt />
      <img class="avatar-img" :src="userInfo.avatar" />
    </div>
    <!-- <canvas ref="chartContainer" class="chart-container"></canvas> -->
    <radar-chart :data="chartData" class="chart-container"></radar-chart>
    <h2 class="page-sub-title">主要特征</h2>
    <section class="d-flex flex-wrap">
      <section
        class="d-flex justify-center"
        style="width: 50%"
        v-for="(item, index) in answerLabels"
        :key="index"
        :class="{'bottom-tag':index >= 2}"
      >
        <div class="label-tag">{{item}}</div>
      </section>
    </section>
    <h2 class="page-sub-title no-mgn">兴趣倾向</h2>
    <table class="result-table">
      <tr>
        <td>{{interestings[0]}}</td>
      </tr>
      <tr>
        <td>{{interestings[1]}}</td>
      </tr>
    </table>
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

    private onDataLoaded() {
        this.genChartData();
        this.initLabelTags();
        this.initInterestings();
    }

    private initLabelTags() {
        const labelString = this.data[0]?.answerLabels || "";
        this.answerLabels = labelString.split("，");
    }

    private initInterestings() {
        const intertesting = this.data[0]?.answerDescribe || "";
        this.interestings = intertesting.split("|");
        // this.answerLabels = intertesting.split("，");
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

        this.data = rsp.data.data;
        this.onDataLoaded();
    }

    private genChartData() {
        const dataTypeMap: Dict<Option> = {};

        for (const item of this.data) {
            dataTypeMap[item.answerType!] = item;
        }

        const data = ALL_TYPES.map((type, index) => {
            const dataItem = dataTypeMap[type] || {
                answerType: type,
                levels: 4
            };
            return {
                label: dataItem.answerType!,
                weight:
                    dataItem.levels !== 4
                        ? (4 - dataItem.levels) * 0.333
                        : Math.random() * 0.2 + 0.1
            };
        });

        this.chartData = data;
    }

    get userInfo(): UserInfo {
        return this.$store.state.userState.userInfo;
    }
}
</script>