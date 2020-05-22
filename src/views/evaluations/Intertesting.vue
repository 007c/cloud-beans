<style lang="less" scoped>
.close-btn {
    top: -55%;
    right: -30%;
    z-index: 2;
}
</style>
<template>
  <v-container v-if="data">
    <p
      class="body-2"
      style="text-indent: 2em"
    >恭喜你！你获得了一次自主选择生活环境的机会！你将有机会从六个岛屿中选择一个作为自己生活的地方。在岛上我们会与的兴趣、理念等似的人一起生活、一起工作。</p>
    <span class="body-2">
      请依次选出你
      <span class="blue--text">最想去的3个岛屿</span>
      ：
    </span>

    <v-row>
      <v-col>
        <v-badge
          style="position: relative"
          v-for="(item, i) in anwsers"
          :key="item.id"
          :content="'No ' + (i + 1)"
          left
          offset-x="30"
          offset-y="10"
          class="mr-6"
        >
          <v-btn color="primary" outlined>{{item.title}}</v-btn>
          <v-btn @click="removeAnwser(i)" class="close-btn" icon color="red" absolute right bottom>
            <v-icon small>cancel</v-icon>
          </v-btn>
        </v-badge>
      </v-col>
    </v-row>

    <v-list>
      <v-list-item
        @click="selectAnwser(item)"
        v-for="item in data"
        :key="item.id"
        class="mb-2 pa-0"
      >
        <v-card flat tile outlined class="pa-2">
          <v-list-item-title>{{item.title}}</v-list-item-title>
          <v-card-text>{{item.content}}</v-card-text>
        </v-card>

        <v-overlay light :opacity="0.1" :value="showOverlay(item)" absolute>
          <v-icon x-large color="primary">check</v-icon>
        </v-overlay>
      </v-list-item>
    </v-list>
    <v-btn block color="primary" @click="submitEvaluation" :disabled="isSummitDisabled">查看测试报告</v-btn>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { withLoading } from "@/decorators/with-loading";
interface Option {
    answer: string;
    answerDescribe: null;
    answerLabels: null;
    answerType: null;
    content: string;
    id: string;
    orderNum: number;
    testID: number;
    title: string;
}

const MAX_ANWSER_COUNT = 3;

@Component
export default class extends Vue {
    @Prop() private data!: Option[];

    private anwsers: Option[] = [];
    // @Watch('data')
    // private onDataChange() {

    // }

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

    private showOverlay(option: Option): boolean {
        return this.anwsers.findIndex((item) => item === option) !== -1;
    }

    get isSummitDisabled() {
        return this.anwsers.length < MAX_ANWSER_COUNT;
    }

    @withLoading()
    private async submitEvaluation() {
        try {
            const rsp = await this.$http.put("/api/Tests/SaveUserTest1Answer", {
                testID: this.$route.params.id,
                answers: this.anwsers.map((item) => item.answer).join(",")
            });

            this.$router.push("/evaluation/result/1");
        } catch (ex) {
            // submit error
        }
    }
}
</script>