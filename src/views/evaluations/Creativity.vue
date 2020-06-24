<style lang="less" scoped>
.close-btn {
    top: -55%;
    right: -30%;
    z-index: 2;
}
</style>
<template>
  <v-container v-if="data">
    <span class="body-2">请在以下标签中，选出每个你认为能准确描述你的形容词。</span>
    <v-row>
      <v-col>
        <v-btn
          class="mx-1 my-1"
          small
          :outlined="item.selected ? false : true"
          color="primary"
          v-for="item in data"
          :key="item.itemID"
          @click="toggleSelect(item)"
        >{{item.content}}</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn block color="primary" @click="submitEvaluation" :disabled="isSummitDisabled">查看测试报告</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { withLoading } from "@/decorators/with-loading";
export interface Option {
    content: string;
    id: string;
    orderNum: number;
    testID: number;
    title: string;
    levels: number;
    selected?: boolean;
}

const MAX_ANWSER_COUNT = 3;

@Component
export default class extends Vue {
    private data: Option[] = [];

    private anwsers: Option[] = [];
    // @Watch('data')
    // private onDataChange() {

    // }

    private created() {
        this.getEvaluations();
    }

    private toggleSelect(item: Option) {
        item.selected = !item.selected;
    }

    private selectAnwser(option: Option) {
        if (this.anwsers.findIndex((item) => item === option) !== -1) {
            return;
        }
        this.anwsers.push(option);
        if (this.anwsers.length > MAX_ANWSER_COUNT) {
            this.anwsers.shift();
        }
    }

    private removeAnwser(i: number) {
        this.anwsers.splice(i, 1);
    }

    private getRangeText(gradePoint: number) {
        type CreativityRange = (grade: number) => string | undefined;
        const creativity90: CreativityRange = function(grade: number) {
            if (grade < 10) {
                return "90分创造力";
            }
        };
        const creativity92: CreativityRange = function(grade: number) {
            if (grade >= 10 && grade <= 12) {
                return "92分创造力";
            }
        };

        const creativity95: CreativityRange = function(grade: number) {
            if (grade >= 13 && grade <= 15) {
                return "92分创造力";
            }
        };

        const creativity98: CreativityRange = function(grade: number) {
            if (grade >= 16 && grade <= 18) {
                return "92分创造力";
            }
        };
        const creativityUnknown: CreativityRange = function(grade: number) {
            return "unknown";
        };
        const iterator: CreativityRange[] = [
            creativity90,
            creativity92,
            creativity95,
            creativity98,
            creativityUnknown
        ];

        for (const consumer of iterator) {
            const ret: string | undefined = consumer(gradePoint);
            if (ret) {
                return ret;
            }
        }
    }

    private showOverlay(option: Option): boolean {
        return this.anwsers.findIndex((item) => item === option) !== -1;
    }

    get isSummitDisabled() {
        return this.data.filter((item) => item.selected).length === 0;
    }

    private async getEvaluations() {
        const rsp = await this.$http.get<ResponseModel<{ itemLsit: Option[] }>>(
            "/api/Tests/GetTest2Options",
            {
                params: {
                    testid: this.$route.params.id
                }
            }
        );

        this.walkData(rsp.data.data.itemLsit);
        this.data = rsp.data.data.itemLsit;
    }

    private walkData(data: Option[]) {
        data.forEach((item) => (item.selected = false));
    }

    @withLoading()
    private async submitEvaluation() {
        let gradePoint = 0;
        this.data
            .filter((item) => item.selected)
            .forEach((item) => {
                gradePoint += parseInt(item.title, 10);
            });
        try {
            const rsp = await this.$http.put("/api/Tests/SaveUserTest3Answer", {
                testID: this.$route.params.id,
                answers: this.getRangeText(gradePoint) + "|" + gradePoint
            });

            this.$emit("submited");
        } catch (ex) {
            // submit error
        }
    }
}
</script>