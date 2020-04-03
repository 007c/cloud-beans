<template>
  <v-container>
    <v-list>
      <v-list-item class="pa-0">
        <v-list-item-content>
          <v-list-item-title class="grey--text text--darken-3">院校分数线</v-list-item-title>
          <v-row justify="center" align="center" class="mt-4" no-gutters>
            <v-col cols="2">
              <span class="caption pt-2">北京</span>
            </v-col>
            <v-col class="pr-2" align="center" cols="5">
              <v-select
                class="caption"
                hide-details
                label="学科"
                dense
                v-model="universutySubject"
                :items="subjectItems"
                item-text="text"
                item-value="value"
              ></v-select>
            </v-col>
            <v-col cols="5" class="pl-2">
              <v-select
                class="caption"
                hide-details
                label="年份"
                dense
                :items="yearItems"
                item-text="text"
                v-model="universityYear"
                item-value="value"
              ></v-select>
            </v-col>
          </v-row>
          <v-simple-table class="mt-4 text-center">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-center pa-0">批次</th>
                  <th class="text-center pa-0">招生类型</th>
                  <th class="text-center pa-0">最低分</th>
                  <th class="text-center pa-0">平均分</th>
                  <th class="text-center pa-0">省控线</th>
                  <th class="text-center pa-0">录取概率</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in tableData" :key="item.batch">
                  <td>{{item.batch}}</td>
                  <td>{{item.type}}</td>
                  <td>{{item.lowest}}</td>
                  <td>{{item.highest}}</td>
                  <td>{{item.line}}</td>
                  <td>{{item.rate}}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item class="pa-0">
        <v-list-item-content>
          <v-list-item-title class="grey--text text--darken-3">专业分数线</v-list-item-title>
          <v-row justify="center" align="center" class="mt-4" no-gutters>
            <v-col cols="2">
              <span class="caption pt-2">北京</span>
            </v-col>
            <v-col align="center" cols="3">
              <v-select
                class="caption"
                hide-details
                label="学科"
                dense
                v-model="majorSubject"
                :items="subjectItems"
                item-text="text"
                item-value="value"
              ></v-select>
            </v-col>
            <v-col class="pl-2 pr-2" cols="4">
              <v-select
                class="caption"
                hide-details
                label="年份"
                dense
                :items="yearItems"
                item-text="text"
                v-model="majorYear"
                item-value="value"
              ></v-select>
            </v-col>
            <v-col cols="3">
              <v-select
                class="caption"
                hide-details
                label="批次"
                dense
                :items="batchItems"
                item-text="text"
                v-model="majorBatch"
                item-value="value"
              ></v-select>
            </v-col>
          </v-row>
          <v-simple-table class="mt-4 text-center">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-center pa-0">专业</th>
                  <th class="text-center pa-0">最低分</th>
                  <th class="text-center pa-0">最高分</th>
                  <th class="text-center pa-0">平均分</th>
                  <th class="text-center pa-0">录取概率</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in majorTableData" :key="item.major">
                  <td>{{item.major}}</td>
                  <td>{{item.lowest}}</td>
                  <td>{{item.highest}}</td>
                  <td>{{item.average}}</td>
                  <td>{{item.rate}}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { withLoading } from "../decorators/with-loading";

interface SelectOption<T> {
    text: string;
    value: T;
}

interface TableItem {
    batch: string;
    type: string;
    lowest: number;
    highest: number;
    line: number;
    rate: number;
}

interface MajorTableItem {
    major: string;
    lowest: number;
    highest: number;
    average: number;
    rate: number;
}

const YEAR_ITEMS_COUNT = 5;

@Component({
    name: "RecruitInfo"
})
export default class extends Vue {
    private yearItems: SelectOption<number>[] = [];
    private subjectItems: SelectOption<string>[] = [
        {
            text: "理科",
            value: "0"
        },
        {
            text: "文科",
            value: "1"
        }
    ];

    private batchItems: SelectOption<number>[] = [
        {
            text: "本科一批",
            value: 0
        },
        {
            text: "本科二批",
            value: 1
        },
        {
            text: "专科批",
            value: 2
        }
    ];
    private universityYear: number = new Date().getFullYear() - 1;
    private majorYear: number = new Date().getFullYear() - 1;
    private universutySubject: string = "0";
    private majorSubject: string = "0";
    private majorBatch: number = 0;

    private tableData: TableItem[] = [];

    private majorTableData: MajorTableItem[] = [];

    private mounted() {
        const nowYear = new Date().getFullYear();
        const yearItems = [];
        for (let i = 1; i <= YEAR_ITEMS_COUNT; i++) {
            yearItems.push({
                text: nowYear - i + "年",
                value: nowYear - i
            });
        }

        this.yearItems = yearItems;

        this.getUniversityTableData();
        this.getMajorTableData();
    }
    @withLoading()
    private async getUniversityTableData() {
        return await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
                this.tableData = [
                    {
                        batch: "一批",
                        type: "理科",
                        lowest: 521,
                        highest: 571,
                        line: 550,
                        rate: 0.56
                    },
                    {
                        batch: "二批",
                        type: "理科",
                        lowest: 471,
                        highest: 521,
                        line: 501,
                        rate: 0.76
                    }
                ];
            }, 1000);
        });
    }

    @withLoading()
    private async getMajorTableData() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
                this.majorTableData = [
                    {
                        major: "电子信息技术",
                        lowest: 521,
                        highest: 541,
                        average: 533,
                        rate: 0.56
                    },
                    {
                        major: "光电信息",
                        lowest: 521,
                        highest: 541,
                        average: 533,
                        rate: 0.56
                    },
                    {
                        major: "计算机科学",
                        lowest: 521,
                        highest: 541,
                        average: 533,
                        rate: 0.56
                    },
                    {
                        major: "数学",
                        lowest: 521,
                        highest: 541,
                        average: 533,
                        rate: 0.56
                    },
                    {
                        major: "对外贸易",
                        lowest: 521,
                        highest: 541,
                        average: 533,
                        rate: 0.56
                    },
                    {
                        major: "审计学",
                        lowest: 521,
                        highest: 541,
                        average: 533,
                        rate: 0.56
                    }
                ];
            }, 1000);
        });
    }
}
</script>