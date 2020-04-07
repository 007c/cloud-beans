<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="2">
        <v-btn icon color="primary">
          <v-icon>arrow_back</v-icon>
        </v-btn>
      </v-col>
      <v-col class="d-flex align-center justify-center">
        <h1 class="primary--text subtitle-1 text-center font-weight-bold">院校查询</h1>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row>
      <v-col class="pl-6 pr-6">
        <v-text-field
          height="15px"
          hide-details
          dense
          outlined
          append-icon="search"
          placeholder="请输入院校名称"
          v-model="universityName"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row class="mt-4">
      <v-col>
        <v-text-field
          class="caption"
          :value="areaText"
          hide-details
          dense
          readonly
          @click="showAreaPicker = true"
          label="地区"
        ></v-text-field>
        <Picker
          :defaultValue="defaultValue"
          @onChange="onAreaChange"
          @update:show="showAreaPicker=false"
          :list="areaList"
          :isRelate="true"
          :isMulti="true"
          :show="showAreaPicker"
        ></Picker>
      </v-col>
      <v-col>
        <v-select
          class="caption"
          hide-details
          label="院校类型"
          dense
          :items="universityTypes"
          item-text="text"
          v-model="universityType"
          item-value="value"
        ></v-select>
      </v-col>
      <v-col>
        <v-select
          class="caption"
          hide-details
          label="院校层次"
          dense
          :items="universityLevels"
          item-text="text"
          v-model="universityLevel"
          item-value="value"
        ></v-select>
      </v-col>
      <v-col>
        <v-select
          class="caption"
          hide-details
          label="院校标签"
          dense
          multiple
          :items="universityTags"
          item-text="text"
          v-model="universityTag"
          item-value="value"
        ></v-select>
      </v-col>
    </v-row>
    <v-list>
      <v-list-item class="pa-0 mb-2" v-for="(item, index) in listData" :key="index">
        <v-card width="100%" class="d-flex pl-2 pr-2">
          <div class="d-flex align-center">
            <v-list-item-avatar color="secondary" class="mr-2" size="60">
              <v-img :src="item.logo" v-if="item.logo"></v-img>
              <span v-else class="white--text">{{item.university.substring(0,1)}}</span>
            </v-list-item-avatar>
          </div>
          <v-list-item-content>
            <v-list-item-title>{{item.university}}</v-list-item-title>
            <v-list-item-content class="pt-1">
              <v-row no-gutters class="caption">
                <v-col class="pa-0" cols="2">综合类</v-col>
                <v-col class="pa-0 pl-2" cols="5">211 985 双一流</v-col>
                <v-col class="pa-0 pl-2">2019年分数线：665</v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item-content>
        </v-card>
      </v-list-item>
    </v-list>
  </v-container>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import {
  universityTypes,
  universityLevels,
  universityTags
} from "./selectOptions";

interface ListItem {
  logo: string;
  university: string;
}

@Component({
  name: "universitySearch"
})
export default class extends Vue {
  private universityName: string = "";
  private showAreaPicker: boolean = false;

  private defaultValue = [1, 3];

  private areaText: string = "";

  private universityTypes = universityTypes;

  private universityLevels = universityLevels;

  private universityTags = universityTags;

  private universityType = 0;

  private universityLevel = 0;

  private universityTag = 0;

  private listData: ListItem[] = [];

  private areaList: AreaTree[] = [
    {
      label: "四川",
      value: 1,
      children: [
        {
          label: "成都",
          value: 2
        },
        {
          label: "绵阳",
          value: 3
        }
      ]
    }
  ];

  private created() {
    this.getListData();
  }

  private onAreaChange(res: AreaTree[], isEnsure: boolean) {
    if (!isEnsure) {
      return;
    }
    this.defaultValue = res.map((item) => item.value);
    this.areaText = res.map((item) => item.label).join("");
  }

  private async getListData() {
    this.listData = [
      {
        logo: "",
        university: "西南大学"
      },
      {
        logo: "",
        university: "北京大学"
      }
    ];
  }
}
</script>