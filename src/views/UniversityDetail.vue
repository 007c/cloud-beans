<template>
  <v-container v-if="universityDetail" class="pt-0">
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
      </v-row>-->
      <header-bar
        :followed="followed"
        @follow="followUniversity"
        :title="universityDetail.fullName"
        with-follow
      ></header-bar>
      <v-divider></v-divider>
    </div>
    <v-row>
      <v-col>
        <v-card flat>
          <v-row>
            <v-col class="d-flex align-center justify-center pb-0" cols="3">
              <v-avatar color="teal" class="mr-2" size="60">
                <v-img :src="'./static/logo/' + universityDetail.fullName + '.jpg'"></v-img>
                <!-- <span v-else class="white--text">西</span> -->
              </v-avatar>
            </v-col>
            <v-col class="pl-0 pb-0 d-flex flex-column caption justify-space-between">
              <p class="mb-0">院校类型：{{universityDetail.eduTypeName}}</p>
              <p class="mb-0">院校标签：{{universityDetail.labels}}</p>
              <p class="mb-0 row no-gutters">
                <span
                  class="d-inline-block text-truncate col-8 pa-0"
                >院校位置：{{universityDetail.areaName}}</span>
                <a :href="universityDetail.siteUrl" class="col-4 pa-0 text-right">学校官网</a>
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
            <v-card-text>{{description}}</v-card-text>
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
import { ListItem } from "../components/UniversityRow.vue";
import { loadUniversityDesc } from "@/util/static-loader";

@Component({
    name: "UniversityDetail",
    components: {
        MatriculateData,
        RecruitInfo
    }
})
export default class extends Vue {
    private universityDetail: ListItem | null = null;
    private universityId!: number;
    private followed: boolean = false;

    private description: string = "";

    private universityLogo: string =
        "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585904564715&di=bfc1df6022e4a5c0bbf7240d76a430d3&imgtype=0&src=http%3A%2F%2Fimg.gaosan.com%2Fupload%2F2017-5%2F52ddc53c4b0cc.jpg";

    private tabs: string[] = ["院校简介", "录取数据", "招生简章"];

    private created() {
        const route = this.$route;
        this.universityId = parseInt(route.params.id, 10);
        this.getUniversityDetail();
    }

    @withLoading()
    private async getUniversityDetail() {
        const rsp = await this.$http.get<ResponseModel<ListItem>>(
            "/api/Universitys/GetBase",
            {
                params: {
                    SchoolID: this.universityId
                }
            }
        );

        const { data } = rsp.data;
        this.universityDetail = data;
        this.loadDescription(data.fullName);
    }

    private async loadDescription(universityName: string) {
        try {
            const rsp = await loadUniversityDesc(universityName);
            this.description = rsp.data;
        } catch (ex) {
            this.description = "";
        }
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