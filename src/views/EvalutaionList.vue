<style lang="less" scoped>
.warp-text {
    overflow-x: auto;
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;
}
.title-bar {
    position: relative;
    z-index: 2;
}
</style>
<template>
  <v-container>
    <v-list>
      <v-list-item
        :to="'/evaluation/list/' + item.testID"
        dense
        class="pa-0 mb-3 d-flex flex-column"
        v-for="item in evaluationList"
        :key="item.id"
      >
        <v-card width="86%" class="body-2 py-1 text-center mb-n3 title-bar" flat outlined tile>
          <v-icon class="mb-1 mr-1" small>school</v-icon>
          <span>{{item.testCount}}已测</span>
          <span class="mx-6">|</span>
          <v-icon small class="mb-1 mr-1">class</v-icon>
          <span>题目：{{item.optionNum}}道精选</span>
        </v-card>
        <v-card class="row px-2 py-4" outlined tile width="100%">
          <div class="col col-2 pa-0 mr-3">
            <v-list-item-avatar color="blue" size="60">
              <span class="white--text">{{item.title.substring(0, 1)}}</span>
            </v-list-item-avatar>
          </div>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">{{item.title}}</v-list-item-title>
            <pre class="caption warp-text">{{item.topicDescribe.replace(/\r\n/, "")}}</pre>
          </v-list-item-content>
        </v-card>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import { withLoading } from "@/decorators/with-loading";

interface EvalutaionItem {
    testID: number;
    title: string;
    topicDescribe: string;
    logUrl: null;
    testTypeID: number;
    testCount: number;
    isvalid: number;
    orderNum: number;
    stemDescribe: string;
    optionNum: number;
    id: string;
}

@Component
export default class extends Vue {
    private evaluationList: EvalutaionItem[] = [];

    private created() {
        this.getEvaluations();
    }

    @withLoading()
    private async getEvaluations() {
        const rsp = await this.$http.get<ResponseModel<EvalutaionItem[]>>(
            "/api/Tests/GetTestList"
        );

        this.evaluationList = rsp.data.data;
    }
}
</script>