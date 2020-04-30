<template>
  <v-container>
    <v-row>
      <v-col class="grey--text text--darken-1 pl-4">招生办电话： {{telphone}}</v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row>
      <v-col class="grey--text text--darken-1 pl-4">学校邮箱： 
        <a :href="'mailto:' + email">{{email}}</a>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row justify="center" align="center" class="mt-8" no-gutters>
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
            <th class="text-center pa-0">学科门类</th>
            <th class="text-center pa-0">专业</th>
            <th class="text-center pa-0">批次</th>
            <th class="text-center pa-0">计划招生</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.batch">
            <td>{{item.subject}}</td>
            <td>{{item.major}}</td>
            <td>{{item.batch}}</td>
            <td>{{item.planRecruit}}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { withLoading } from "../decorators/with-loading";
import { subjectItems, yearItems } from "./selectOptions";

interface TableItem {
    subject: string;
    major: string;
    batch: string;
    planRecruit: number;
}

@Component({
    name: "RecruitInfo"
})
export default class extends Vue {
    @Prop() private email!: string;

    private telphone: string = "";
    private site: string = "";

    private subjectItems: Array<SelectOption<string>> = subjectItems;
    private yearItems: Array<SelectOption<number>> = yearItems;

    private tableData: TableItem[] = [];

    private universutySubject: string = "0";

    private universityYear: number = new Date().getFullYear() - 1;

    private created() {
        this.getRecruitInfo();
    }

    @withLoading()
    private async getRecruitInfo() {
        await new Promise((reslove, reject) => {
            setTimeout(() => {
                reslove();
            }, 2000);
        });

        this.telphone = "028-2312-4412";
        this.site = "www.spwu.com";
        this.tableData = [
            {
                subject: "理科",
                major: "computer sicence",
                batch: "一批",
                planRecruit: 1200
            }
        ];
    }
}
</script>