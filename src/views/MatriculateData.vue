<template>
  <v-container>
    <v-list>
      <v-list-item class="pa-0">
        <v-list-item-content>
          <v-list-item-title class="grey--text text--darken-3">院校分数线</v-list-item-title>
          <v-row justify="center" align="center" class="mt-4" no-gutters>
            <v-col cols="2">
              <span class="caption pt-2">四川</span>
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
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in tableData" :key="item.batch">
                  <td>{{item.batch}}</td>
                  <td>{{item.type}}</td>
                  <td>{{item.lowest}}</td>
                  <td>{{item.highest}}</td>
                  <td>{{item.line}}</td>
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
              <span class="caption pt-2">四川</span>
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
                 @change="getMajorTableData"
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
                 @change="getMajorTableData"
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
                 @change="getMajorTableData"
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
                </tr>
              </thead>
              <tbody v-if="majorTableData.length > 0">
                <tr v-for="item in majorTableData" :key="item.majorName">
                  <td>{{item.majorName}}</td>
                  <td>{{item.minScore}}</td>
                  <td>{{item.maxScore}}</td>
                  <td>{{item.avgScore}}</td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="4" class="caption">暂无数据</td>
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
import { Vue, Component, Prop, Inject } from "vue-property-decorator";
import { withLoading } from "../decorators/with-loading";

// interface SelectOption<T> {
//     text: string;
//     value: T;
// }

interface TableItem {
    batch: string;
    type: string;
    lowest: number;
    highest: number;
    line: number;
    rate: number;
}

interface MajorTableItem {
    majorName: string;
    minScore: number;
    maxScore: number;
    avgScore: number;
}

import { subjectItems, yearItems } from "./selectOptions";
import { mapGetters } from "vuex";
import { Subject } from '@/store/use-state';
@Component({
    name: "MatriculateData",
    computed: {
        ...mapGetters(["yearItems", "batchItems"])
    }
})
export default class extends Vue {
    @Inject("schoolId") private universityId!: number;
    private subjectItems: Array<SelectOption<number>> = subjectItems;
    private universityYear: number = new Date().getFullYear() - 1;
    private majorYear: number = new Date().getFullYear() - 1;
    private universutySubject: number = Subject.理科;
    private majorSubject: number = Subject.理科;
    private majorBatch: number = 1;

    private tableData: TableItem[] = [];

    private majorTableData: MajorTableItem[] = [];

    private mounted() {
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
        const rsp = await this.$http.get<ResponseModel<MajorTableItem[]>>(
            "/api/Universitys/GetSchoolMajorPageList",
            {
                params: {
                    SchoolID: parseInt(this.$route.params.id, 10),
                    DivisionTypeID: this.majorSubject,
                    Year: this.majorYear,
                    BatchID: this.majorBatch,
                    PageIndex: 1,
                    PageSize: 1000,
                }
            }
        );

        this.majorTableData = rsp.data.data;
    }
}
</script>