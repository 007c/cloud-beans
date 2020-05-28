<template>
  <v-container v-if="universityDetail" class="pt-0">
    <div class="pt-2" style="position: sticky; top: 0; z-index: 1; background: #fff">
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
              <v-avatar color="secondary" class="mr-2" size="60">
                <v-img
                  v-if="universityDetail.hasLogo"
                  @error="universityDetail.hasLogo=false"
                  :src="'./static/logo/' + universityDetail.fullName + '.jpg'"
                ></v-img>
                <span v-else class="white--text">{{universityDetail.fullName.substring(0, 1)}}</span>
              </v-avatar>
            </v-col>
            <v-col class="pl-0 pb-0 d-flex flex-column caption justify-space-between">
              <p class="mb-0">
                院校类型：{{universityDetail.eduTypeName}}
                <advisory-btn :postfix="universityDetail.fullName" @click.native.stop :typeCode="1" class="ml-2 mt-n1"></advisory-btn>
              </p>
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
          <recruit-info :email="universityDetail.email"></recruit-info>
        </v-tab-item>
      </v-tabs>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide } from "vue-property-decorator";
import { withLoading } from "../decorators/with-loading";
import MatriculateData from "./MatriculateData.vue";
import RecruitInfo from "./RecruitInfo.vue";
import { loadUniversityDesc } from "@/util/static-loader";
import { ListItem } from "../components/UniversityRowBase.vue";

@Component({
    name: "UniversityDetail",
    components: {
        MatriculateData,
        RecruitInfo
    }
})
export default class extends Vue {
    private universityDetail: ListItem | null = null;
    @Provide("schoolId") private universityId!: number;
    private followed: boolean = false;

    private description: string = "";

    private tabs: string[] = ["院校简介", "录取数据", "招生简章"];

    private created() {
        const route = this.$route;
        this.universityId = parseInt(route.params.id, 10);
        this.getUniversityDetail();
        this.getUniversityFollowedStatus();
    }

    @withLoading()
    private async getUniversityFollowedStatus() {
        const rsp = await this.$http.get<ResponseModel<string>>(
            "/api/UniversityCollections/JudgeCollected",
            {
                params: {
                    schoolid: this.universityId
                }
            }
        );

        this.followed = JSON.parse(rsp.data.data);
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
        data.hasLogo = true;
        this.universityDetail = data;
        this.loadDescription(data.fullName);
    }

    private async loadDescription(universityName: string) {
        try {
            const rsp = await loadUniversityDesc(universityName);
            this.description = rsp.data;
        } catch (ex) {
            this.description = "暂无";
        }
    }

    @withLoading()
    private async followUniversity() {
        if (!this.followed) {
            await this.$http.post(
                "/api/UniversityCollections/SetCollect",
                this.universityId,
                {
                    headers: {
                        "content-type": "application/json-patch+json"
                    }
                }
            );
        } else {
            await this.$http.delete(
                "/api/UniversityCollections/CancleCollect",
                {
                    data: this.universityId,
                    headers: {
                        "content-type": "application/json-patch+json"
                    }
                }
            );
        }

        this.followed = !this.followed;
    }
}
</script>