<style lang="less" scoped>
.container {
    background-image: url("./images/bg1.png");
    background-attachment: scroll;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    font-family: "Microsoft Yahei";
    overflow: auto;
}
.evaluations-title {
    margin-top: 23px;
    width: 678px;
    height: 122px;
    background-position: 0 -2px;
    background-size: 100%;
    margin-left: 44px;
    overflow: auto;
    position: relative;
}
.chart-container {
    height: 512px;
    width: 100%;
    display: block;
}
.page-sub-title {
    width: 150px;
    height: 60px;
    background: url("./images/界面(1)(1)_06.gif") no-repeat left bottom;
    background-size: 100%;
    font-size: 30px;
    color: #000;
    display: flex;
    justify-content: center;
    line-height: 48px;
    margin-top: -18px;
    margin-left: 21px;
    margin-bottom: 10px;
    &.no-mgn {
        margin-top: 12px;
    }
}

.label-tag {
    width: 202px;
    height: 74px;
    background: url("./images/界面(1)(1)_10.gif") no-repeat;
    background-size: 100%;
    font-size: 30px;
    line-height: 48px;
    color: #000000;
    font-weight: bold;
    display: flex;
    justify-content: center;
    padding-top: 6px;
}
.bottom-tag {
    margin-top: 30px;
}
.result-table {
    width: 655px;
    border: 3px solid #000000;
    border-collapse: collapse;
    margin: 0 auto;
    font-size: 24px;
    line-height: 50px;
    color: #000000;
    line-height: 1.2em;
    font-weight: bold;
    > tr {
        border-top: 2px solid rgba(0, 0, 0, 0.6);
        &:nth-child(1) {
            border-top: none;
        }
    }
    td {
        padding: 21px;
    }
}
.page-footer {
    display: flex;
    margin-top: 40px;
    font-size: 26px;
    line-height: 34px;
    color: #000000;
    font-family: "Microsoft YaHei";
    font-weight: bold;
    align-items: center;
}
.qr-code {
    width: 120px;
    height: 120px;
    background-size: 100%;
    margin-right: 30px;
    margin-left: 31px;
}
.desc-text {
    margin-bottom: 0;
}
.avatar-img {
    width: 87px;
    height: 84px;
    margin-top: 26px;
    margin-left: 14px;
}
.img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}
.img-container {
    position: relative;
}
</style>

<template>
  <v-container class="container pa-0 pb-1">
    <div class="evaluations-title img-container">
      <img src="/static/img/界面(1)(1)_03.png" class="img" alt />
      <img class="avatar-img" :src="userInfo.avatar" />
    </div>
    <canvas ref="chartContainer" class="chart-container"></canvas>
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

const MAX_ANWSER_COUNT = 3;
@Component
export default class extends Vue {
    @Prop() private data!: Option[];

    private answerLabels: string[] = [];

    private interestings: string[] = [];

    @Watch("data")
    private onDataLoaded() {
        this.drawChart();
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

    private drawChart() {
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
                label: dataItem.answerType,
                weight: (4 - dataItem.levels) * 0.333
            };
        });

        data.sort((a, b) => a.weight - b.weight);
        console.log("data: ", data);

        const chart = new F2.Chart({
            el: this.$refs.chartContainer,
            pixelRatio: window.devicePixelRatio,
            padding: [12, "auto", 12, "auto"]
        });

        chart.coord("polar");
        chart.source(data, {
            weight: {
                min: 0,
                max: 1,
                nice: false,
                tickCount: 5
            }
        });

        chart.axis("weight", {
            label: function label(text: string, index: number, total: number) {
                return null;
            },
            grid: function grid(text: string, index: number) {
                if (index === 4) {
                    return {
                        lineDash: null,
                        type: "arc",
                        stroke: "#000",
                        lineWidth: 1.5
                    };
                }

                if (index <= 2) {
                    return {
                        lineDash: [5, 3],
                        type: "arc",
                        stroke: "#514f4f",
                        lineWidth: 1.5
                    };
                }

                return {
                    lineDash: null,
                    type: "arc",
                    stroke: "#514f4f",
                    lineWidth: 1.5
                };
            },
            line: {
                top: true,
                stroke: "#000"
            }
        });

        chart.axis("label", {
            grid: {
                lineDash: null,
                stroke: "#000",
                top: true
            },
            label: {
                stroke: "#000",
                fontSize: 12,
                fontWeight: 100
            }
        });
        chart
            .area()
            .position("label*weight")
            .style({
                fill: "#4e74ae",
                stroke: "#4e74ae",
                fillOpacity: 1
            })
            .animate({
                appear: {
                    animation: "groupWaveIn"
                }
            });
        chart
            .line()
            .position("label*weight")
            .color("#000000")
            .style({
                lineWidth: 0.5
            })
            .animate({
                appear: {
                    animation: "groupWaveIn"
                }
            });

        chart.legend(false);
        chart.render();
    }

    get userInfo(): UserInfo {
        return this.$store.state.userState.userInfo;
    }
}
</script>