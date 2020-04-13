<template>
  <v-container class="pt-0">
    <div class="pt-2" style="position: sticky; top: 0; z-index: 1; background: #fff">
      <!-- <v-row no-gutters>
        <v-col cols="2">
          <v-btn @click="$router.go(-1)" icon color="primary">
            <v-icon>arrow_back</v-icon>
          </v-btn>
        </v-col>
        <v-col class="d-flex align-center justify-center">
          <h1 class="primary--text subtitle-1 text-center font-weight-bold">{{majorName}}</h1>
        </v-col>
        <v-col cols="2">
          <v-btn @click="followUniversity" icon color="primary">
            <v-icon>{{!follwed ? 'favorite_border' : 'favorite'}}</v-icon>
          </v-btn>
        </v-col>
      </v-row>-->
      <header-bar @follow="followMajor" :followed="followed" :title="majorName" with-follow></header-bar>
      <v-divider></v-divider>
    </div>
    <v-row>
      <v-col>
        <v-card flat>
          <v-row>
            <v-col class="d-flex align-center justify-center pb-0" cols="3">
              <v-avatar color="teal" class="mr-2" size="60">
                <v-img v-if="majorLogo" :src="majorLogo"></v-img>
                <span v-else class="white--text">{{majorName.substring(0,1)}}</span>
              </v-avatar>
            </v-col>
            <v-col class="pl-0 pb-0 d-flex flex-column caption justify-space-between">
              <v-row>
                <v-col class="pa-0">专业代码： 020101</v-col>
                <v-col class="pa-0">学历层次： 本科</v-col>
              </v-row>
              <v-row class="font-weight-bold">
                <v-col class="pa-0">所属学科： 020101</v-col>
                <v-col class="pa-0">所属门类： 本科</v-col>
              </v-row>
              <v-row class="font-weight-bold">
                <v-col class="pa-0">修业年限： 020101</v-col>
                <v-col class="pa-0">授予学位： 本科</v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-tabs grow>
      <v-tab v-for="(name, index) in tabs" :key="index" :href="'#' + index">{{name}}</v-tab>
      <v-tab-item value="0">
        <v-card flat>
          <v-card-text>
            西南石油大学（Southwest Petroleum University）简称“西南石大”，坐落于四川省成都市，是教育部与四川省共建的世界一流学科建设高校 [1] 、国家“特色重点学科项目”建设高校、中国政府奖学金来华留学生接收院校，入选国家中西部高校基础能力建设工程、“111计划”、国家建设高水平大学公派研究生项目、国家大学生文化素质教育基地、全国高校实践育人创新创业基地、新工科研究与实践项目。
            1958年，四川石油学院成立，隶属于原石油工业部；1970年，更名为西南石油学院；2000年，由中国石油天然气集团公司所属的部委院校划转为中央与地方共建、以四川省人民政府管理为主的普通高等学校；2002年，学校主体搬迁到成都市新都区；2004年四川省政法管理干部学院并入；2005年，学校更名为西南石油大学；2008年11月1日，中国石油天然气集团公司、中国石油化工集团公司、中国海洋石油总公司与四川省人民政府签署共建西南石油大学的协议。 [2]
            截至2019年10月，学校建有成都、南充2个校区，校园总面积3000余亩；设有19个教学学院（部），开设72个本科专业；有5个博士后科研流动站，5个一级学科博士点，20个一级学科硕士点，12个专业学位硕士点；有教职工2556人，有全日制在校学生36942人（含非全日制统招硕士生）。 [3-5]
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item value="1">
        <v-row>
          <v-col cols="3">
            <v-text-field
              class="caption"
              v-model="areaText"
              dense
              hide-details
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
          <v-col cols="3">
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
          <v-col cols="3">
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
          <v-col cols="3">
            <v-select
              class="caption"
              hide-details
              label="年份"
              dense
              :items="yearItems"
              item-text="text"
              v-model="year"
              item-value="value"
            ></v-select>
          </v-col>
        </v-row>
        <v-list two-line class="mt-2">
          <v-list-item v-for="item in listData" :key="item.id" class="mb-2 pa-0">
            <v-card width="100%" class="pd-2 pt-2 pl-2 row no-gutters d-flex">
              <div class="col-4 pt-0 pb-0 justify-center d-flex flex-column align-center">
                <v-list-item-avatar color="secondary" class="mb-2" size="60">
                  <v-img :src="item.logo" v-if="item.logo"></v-img>
                  <span v-else class="white--text">{{item.university.substring(0,1)}}</span>
                </v-list-item-avatar>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <h2
                      class="subtitle-2 text-center text-truncate"
                      style="width: 100%"
                      v-on="on"
                    >{{item.university}}</h2>
                  </template>
                  <span>{{item.university}}</span>
                </v-tooltip>
              </div>
              <v-list-item-content class="pa-0 col-8">
                <v-simple-table class="pa-0 text-center">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-center pa-0">最低分</th>
                        <th class="text-center pa-0">平均分</th>
                        <th class="text-center pa-0">平均分</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(batch, index) in item.batches" :key="index">
                        <td>{{batch.lowest}}</td>
                        <td>{{batch.highest}}</td>
                        <td>{{batch.average}}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-list-item-content>
            </v-card>
          </v-list-item>
        </v-list>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { withLoading } from "../decorators/with-loading";
import { universityTypes, universityLevels, yearItems } from "./selectOptions";

interface ListItem {
    university: string;
    logo: string;
    id: string;
    batches: Array<{
        highest: number;
        lowest: number;
        average: number;
    }>;
}

@Component({
    name: "MajorDetail"
})
export default class extends Vue {
    private majorName: string = "经济学";
    private majorId!: number;
    private followed: boolean = false;

    private majorLogo: string = "";

    private tabs: string[] = ["专业简介", "开设院校"];

    private listData: ListItem[] = [];

    private showAreaPicker: boolean = false;

    private defaultValue = [1, 3];

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

    private universityTypes = universityTypes;

    private universityLevels = universityLevels;

    private yearItems = yearItems;

    private universityType = 0;

    private universityLevel = 0;

    private year = new Date().getFullYear() - 1;

    private areaText: string = "";

    private onAreaChange(res: AreaTree[], isEnsure: boolean) {
        if (!isEnsure) {
            return;
        }

        this.areaText = res.map((item) => item.label).join("");
        this.defaultValue = res.map((item) => item.value);
    }

    private created() {
        const route = this.$route;
        this.majorId = parseInt(route.params.id, 10);
        this.getUniversityListOfMajor();
    }

    @withLoading()
    private async followMajor() {
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                this.followed = !this.followed;
                resolve();
            }, 1000);
        });
    }

    @withLoading()
    private async getUniversityListOfMajor() {
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });

        this.listData = [
            {
                id: "9defac-ecffea-dedeaf",
                university: "西南石油大学",
                logo:
                    "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585904564715&di=bfc1df6022e4a5c0bbf7240d76a430d3&imgtype=0&src=http%3A%2F%2Fimg.gaosan.com%2Fupload%2F2017-5%2F52ddc53c4b0cc.jpg",
                batches: [
                    {
                        highest: 520,
                        lowest: 485,
                        average: 501
                    }
                ]
            },
            {
                id: "9defac-ecffea-dedbaf",
                university: "西南大xxxxxxx学",
                logo: "",
                batches: [
                    {
                        highest: 420,
                        lowest: 415,
                        average: 411
                    },
                    {
                        highest: 420,
                        lowest: 415,
                        average: 411
                    }
                ]
            }
        ];
    }
}
</script>