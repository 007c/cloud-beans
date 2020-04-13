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
          <h1
            class="primary--text subtitle-1 text-center font-weight-bold"
          >{{universityName}}</h1>
        </v-col>
        <v-col cols="2">
          <v-btn @click="followUniversity" icon color="primary">
            <v-icon>{{!follwed ? 'favorite_border' : 'favorite'}}</v-icon>
          </v-btn>
        </v-col>
      </v-row> -->
      <header-bar :followed="followed" @follow="followUniversity" :title="universityName" with-follow></header-bar>
      <v-divider></v-divider>
    </div>
    <v-row>
      <v-col>
        <v-card flat>
          <v-row>
            <v-col class="d-flex align-center justify-center pb-0" cols="3">
              <v-avatar color="teal" class="mr-2" size="60">
                <v-img v-if="universityLogo" :src="universityLogo"></v-img>
                <span v-else class="white--text">西</span>
              </v-avatar>
            </v-col>
            <v-col class="pl-0 pb-0 d-flex flex-column caption justify-space-between">
              <p class="mb-0">院校类型：综合类</p>
              <p class="mb-0">院校标签：985 211 双一流</p>
              <p class="mb-0 row no-gutters">
                <span class="d-inline-block text-truncate col-8 pa-0">院校位置：北京市三里屯1205号7楼405</span>
                <a href="https://www.swpu.edu.cn/" class="col-4 pa-0 text-right">学校官网</a>
              </p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
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
          <matriculate-data></matriculate-data>
        </v-tab-item>
        <v-tab-item value="2">
          <recruit-info></recruit-info>
        </v-tab-item>
      </v-tabs>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { withLoading } from "../decorators/with-loading";
import MatriculateData from "./MatriculateData.vue";
import RecruitInfo from "./RecruitInfo.vue";

@Component({
    name: "UniversityDetail",
    components: {
        MatriculateData,
        RecruitInfo
    }
})
export default class extends Vue {
    private universityName: string = "西南大学";
    private universityId!: number;
    private followed: boolean = false;

    private universityLogo: string =
        "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585904564715&di=bfc1df6022e4a5c0bbf7240d76a430d3&imgtype=0&src=http%3A%2F%2Fimg.gaosan.com%2Fupload%2F2017-5%2F52ddc53c4b0cc.jpg";

    private tabs: string[] = ["院校简介", "录取数据", "招生简章"];

    private created() {
        const route = this.$route;
        this.universityId = parseInt(route.params.id, 10);
    }

    @withLoading()
    private async followUniversity() {
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                this.followed = !this.followed;
                resolve();
            }, 1000);
        });
    }
}
</script>