<template>
  <canvas ref="chartContainer"></canvas>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import F2 from "@antv/f2";

export interface RadarChartData {
    label: string;
    weight: number;
}

const MAX_ANWSER_COUNT = 3;
@Component
export default class extends Vue {
    @Prop() private data!: RadarChartData[];
    private chart!: any;
    private mounted() {
        const chart = new F2.Chart({
            el: this.$refs.chartContainer,
            pixelRatio: window.devicePixelRatio,
            padding: [12, "auto", 12, "auto"]
        });
        this.chart = chart;
    }
    @Watch("data")
    private drawChart() {
        const { chart } = this;
        if (!chart) {
            return;
        }
        chart.coord("polar");
        chart.source(this.data, {
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
}
</script>