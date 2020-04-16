<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="3">
        <v-btn @click="$router.go(-1)" icon color="primary">
          <v-icon>arrow_back</v-icon>
        </v-btn>
      </v-col>
      <v-col class="d-flex align-center justify-center">
        <h1 class="primary--text subtitle-1 text-center font-weight-bold">智能择校</h1>
      </v-col>
      <v-col cols="3">
        <v-select class="caption" dense hide-details v-model="choiceMode" :items="choiceItems"></v-select>
      </v-col>
    </v-row>
    <v-divider></v-divider>

    <v-row>
      <student-info-bar></student-info-bar>
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
        <v-card :to="'/university/detail/' + item.id" width="100%" class="d-flex pl-2 pr-2">
          <div class="d-flex align-center mr-3">
            <v-list-item-avatar color="secondary" size="60">
              <v-img :src="item.logo" v-if="item.logo"></v-img>
              <span v-else class="white--text">{{item.university.substring(0,1)}}</span>
            </v-list-item-avatar>
          </div>
          <v-list-item-content>
            <v-row align="center">
              <v-col class="pt-0 pb-0">
                <v-list-item-title>{{item.university}}</v-list-item-title>
              </v-col>
              <v-col class="pt-0 pb-0">
                <span class="body-2 mr-2">四川</span>
                <span class="body-1" :class="getFontClass(item.eage)">保底</span>
              </v-col>
            </v-row>
            <v-list-item-content class="pa-0">
              <v-row no-gutters class="caption">
                <v-col class cols="4" sm="3">综合类</v-col>
                <v-col class cols="8" sm="4">211 985 双一流</v-col>
                <v-col class cols="12" sm="5">2019年分数线：665</v-col>
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
import studentInfoBar from "@/components/StudentInfoBar.vue";
import eventBus from "../event-bus";
import { mapGetters } from "vuex";

interface ListItem {
    logo: string;
    university: string;
    id: number;
}

@Component({
    name: "universitySearch",
    components: {
        studentInfoBar
    },
    computed: {
        ...mapGetters(["universityTypes", "universityLevels", "universityTags"])
    }
})
export default class extends Vue {
    private universityName: string = "";
    private showAreaPicker: boolean = false;

    private defaultValue = [1, 3];

    private areaText: string = "";

    private choiceItems: Array<SelectOption<number>> = [
        {
            text: "分数择校",
            value: 0
        },
        {
            text: "位次择校",
            value: 1
        }
    ];

    private choiceMode: number = 0;

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
        eventBus.$on("bottomTouchUp", this.onBottomTouchUp);
    }

    private getFontClass(eage: number) {
        return "blue--text";
    }

    private beforeDestroy() {
        eventBus.$off("bottomTouchUp", this.onBottomTouchUp);
    }

    private onBottomTouchUp() {
        // console.log("bottom touch up")
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
                university: "西南大学",
                id: 0
            },
            {
                logo: "",
                university: "北京大学",
                id: 1
            }
        ];
    }
}
</script>