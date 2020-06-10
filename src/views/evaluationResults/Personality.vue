<style lang="less" src="./index.less" scoped>
</style>

<style lang="less" scoped>
.desc-panel {
    width: 589px;
    height: 216px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &.bottom {
        margin-top: 30px;
    }
    .header {
        height: 40%;
        font-size: 30px;
        line-height: 42px;
        color: #000000;
        font-family: "F ZZ DH JW";
    }
    .content {
        height: 51%;
        font-size: 26px;
        line-height: 56px;
        color: #000000;
    }
}
</style>

<template>
  <v-container class="container pa-0 pb-1">
    <div class="evaluations-title img-container">
      <img src="/static/img/标题.png" class="img" alt />
      <img class="avatar-img" :src="userInfo.avatar" />
    </div>
    <!-- <canvas ref="chartContainer" class="chart-container"></canvas> -->
    <radar-chart :data="chartData" class="chart-container"></radar-chart>
    <div v-if="data.length !== 0">
      <section v-for="i in 2" class="img-container desc-panel" :class="i==2 ? 'bottom' : ''" :key="i">
        <img class="img" src="/static/img/1.png" alt />
        <h1
          class="header d-flex justify-center align-center"
        >{{data[i-1].answerDescribe.split("|")[1]}}</h1>
        <div
          class="content d-flex justify-center align-center"
        >{{data[i-1].answerDescribe.split("|")[2]}}</div>
      </section>
    </div>
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
        const data: RadarChartData[] = this.data.map(
            (item, index): RadarChartData => {
                return {
                    label: item.answerDescribe?.split("|")[0],
                    weight: item.levels / 40
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