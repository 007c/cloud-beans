<template>
  <v-container>
    <v-row align="center">
      <v-col cols="3">
        <v-btn @click="currentIndex--" :disabled="currentIndex <= 0" color="primary" small>上一题</v-btn>
      </v-col>
      <v-col>
        <v-progress-linear height="8" rounded :value="answeredPercent"></v-progress-linear>
      </v-col>
      <v-col cols="2">{{answeredQuestion}}/{{totalQuestion}}</v-col>
    </v-row>
    <v-row v-if="currentQAPair">
      <v-col class="body-2">{{currentIndex + 1}}、{{currentQAPair.question}}</v-col>
    </v-row>
    <v-row v-if="currentQAPair">
      <v-col class="py-0">
        <van-radio-group v-model="currentQAPair.answer">
          <van-radio
            :key="currentIndex + '-' + item.answer"
            v-for="item in currentQAPair.options"
            :name="item.answer"
            icon-size="16px"
            class="mt-2"
          >
            <span class="body-2">{{item.content}}</span>
          </van-radio>
        </van-radio-group>
      </v-col>
    </v-row>
    <v-row v-if="currentQAPair">
      <v-col cols="12">
        <v-btn
          :disabled="currentQAPair.answer == null || currentIndex >= totalQuestion - 1"
          @click="currentIndex++"
          color="primary"
          class="mt-4"
          block
        >进入下一题</v-btn>
      </v-col>
      <v-col cols="12" class="py-0">
        <v-btn
          @click="commitTest"
          :disabled="answeredQuestion !== totalQuestion"
          color="primary"
          block
        >提交测试</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

interface Option {
    answer: string;
    content: string;
    id: string;
    itemID: number;
    orderNum: number;
    testID: number;
    title: string;
}

interface Question {
    content: string;
    id: string;
    itemID: number;
    orderNum: number;
    testID: number;
    title: string;
}

interface DataItem {
    itemLsit: Question[];
    optionLsit: Option[];
}

interface QAItem {
    title: string;
    question: string;
    id: number;
    options: Option[];
    answer: string | null;
}

@Component
export default class extends Vue {
    private qaPairs: QAItem[] = [];
    private currentIndex: number = 0;

    get currentQAPair(): QAItem {
        return this.qaPairs[this.currentIndex];
    }

    private created() {
        this.getAllQuestions();
    }

    private async getAllQuestions() {
        const rsp = await this.$http.get<ResponseModel<DataItem>>(
            "/api/Tests/GetTest2Options",
            {
                params: {
                    testid: parseInt(this.$route.params.id as string, 10)
                }
            }
        );

        this.resloveData(rsp.data.data);
    }

    get totalQuestion(): number {
        return this.qaPairs.length;
    }

    get answeredQuestion(): number {
        return this.qaPairs.filter((item) => item.answer !== null).length;
    }

    get answeredPercent(): number {
        return (this.answeredQuestion / this.totalQuestion) * 100;
    }

    private resloveData(data: DataItem) {
        const idMap: Dict<QAItem> = {};
        const qaPairs: QAItem[] = [];
        for (const item of data.itemLsit) {
            const pair: QAItem = {
                title: item.title,
                question: item.content,
                id: item.itemID,
                options: [],
                answer: null
            };
            idMap[item.itemID] = pair;
            qaPairs.push(pair);
        }

        for (const item of data.optionLsit) {
            const pair: QAItem | undefined = idMap[item.itemID];
            if (pair) {
                pair.options.push(item);
            }
        }

        this.qaPairs = qaPairs;
    }

    private async commitTest() {
        const countMap: Dict<number> = {};

        for (const item of this.qaPairs) {
            const titles = item.title.split("|");
            for (const title of titles) {
                if (!countMap[title]) {
                    countMap[title] = 0;
                }
                countMap[title]++;
            }
        }

        await this.$http.put(
            "/api/Tests/SaveUserTest4Answer",
            {
                testID: this.$route.params.id,
                answers: Object.keys(countMap)
                    .map((key) => `${key}|${countMap[key]}`)
                    .join(",")
            },
            {
                headers: {
                    "content-type": "application/json-patch+json"
                }
            }
        );

        this.$emit("submited");
    }
}
</script>