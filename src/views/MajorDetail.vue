<template>
  <v-container id="saveContent" class="pt-0">
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
      <header-bar
        @follow="followMajor"
        :followed="followed"
        :title="majorInfo.majorName"
        with-follow
        id="header"
      ></header-bar>
      <v-divider></v-divider>
    </div>
    <v-row>
      <v-col>
        <v-card flat>
          <v-row>
            <v-col class="d-flex align-center justify-center pb-0" cols="3">
              <v-avatar color="teal" class="mr-2" size="60">
                <v-img v-if="majorLogo" :src="majorLogo"></v-img>
                <span v-else class="white--text">{{majorInfo.majorName.substring(0,1)}}</span>
              </v-avatar>
            </v-col>
            <v-col class="pl-0 pb-0 d-flex flex-column caption justify-space-between">
              <v-row>
                <v-col class="pa-0">专业代码： {{majorInfo.majorCode}}</v-col>
                <v-col class="pa-0">学历层次： {{majorInfo.typeName}}</v-col>
              </v-row>
              <v-row class="font-weight-bold">
                <v-col class="pa-0">所属学科： {{majorInfo.majorType}}</v-col>
                <v-col class="pa-0">所属门类： {{majorInfo.majorClass}}</v-col>
              </v-row>
              <v-row class="font-weight-bold">
                <v-col class="pa-0">修业年限： {{majorInfo.eduYear}}</v-col>
                <v-col class="pa-0">授予学位： {{majorInfo.degree}}</v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-tabs grow v-model="tabIndex">
      <v-tab v-for="(name, index) in tabs" :key="index" :href="'#' + index">{{name}}</v-tab>
      <v-tab-item value="0">
        <v-card flat>
          <v-card-subtitle class="pb-0 px-0">
            <span class="font-weight-bold grey--text text--darken-1 body-1">|</span> 专业人气
          </v-card-subtitle>
          <v-card-text class="font-weight-bold px-0 pb-0">
            <span class="mr-2">{{majorInfo.popular}}</span>
            <v-icon
              v-for="item in calculatePolular(majorInfo.popular)"
              :key="item"
              small
              class="mb-1"
              color="red"
            >whatshot</v-icon>
          </v-card-text>
          <v-card-subtitle class="pb-0 px-0">
            <span class="font-weight-bold grey--text text--darken-1 body-1">|</span> 专业简介
          </v-card-subtitle>
          <v-card-text class="px-0 pb-0">{{majorInfo.briefIntro}}</v-card-text>
          <v-card-subtitle class="pb-0 px-0">
            <span class="font-weight-bold grey--text text--darken-1 body-1">|</span> 主干学科
          </v-card-subtitle>
          <v-card-text class="px-0 pb-0">{{majorInfo.majorContent}}</v-card-text>
          <v-card-subtitle class="pb-0 px-0">
            <span class="font-weight-bold grey--text text--darken-1 body-1">|</span> 就业方向
          </v-card-subtitle>
          <v-card-text class="px-0 pb-0">{{majorInfo.workDirection}}</v-card-text>
          <v-card-subtitle class="pb-0 px-0">
            <span class="font-weight-bold grey--text text--darken-1 body-1">|</span> 男女比例
          </v-card-subtitle>
          <v-card-text class="px-0 pb-0">{{majorInfo.genderRate}}</v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item value="1">
        <v-row>
          <v-col cols="6">
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
          <v-col cols="6">
            <v-select
              class="caption"
              hide-details
              label="院校类型"
              dense
              :items="universityTypes"
              item-text="text"
              v-model="universityType"
              item-value="value"
              @change="filterMajorEnsInfo"
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-select
              class="caption"
              hide-details
              label="院校层次"
              dense
              :items="universityLevels"
              item-text="text"
              v-model="universityLevel"
              item-value="value"
              @change="filterMajorEnsInfo"
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-select
              class="caption"
              hide-details
              label="年份"
              dense
              :items="yearItems"
              item-text="text"
              v-model="year"
              item-value="value"
              @change="filterMajorEnsInfo"
            ></v-select>
          </v-col>
        </v-row>
        <v-list two-line class="mt-2">
          <!-- <v-list-item v-for="item in listData" :key="item.id" class="mb-2 pa-0">
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
                <v-list-item-title class="ml-4">
                  <strong class="body-2 grey--text text--darken-1">学科评估结果</strong>
                  <span class="blue--text ml-1">A+</span>
                </v-list-item-title>
                <v-simple-table dense class="pa-0 text-center">
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
          </v-list-item>-->
          <university-row-base
            v-for="item in majorEnsRows"
            :key="item.university.id"
            :item="item.university"
            :showname="true"
          >
            <v-list-item-content class="pa-0 col-8">
              <v-list-item-title class="ml-4">
                <strong class="body-2 grey--text text--darken-1">学科评估结果</strong>
                <span class="blue--text ml-1">{{item.university.grades}}</span>
              </v-list-item-title>
              <v-simple-table dense class="pa-0 text-center">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-center pa-0">录取批次</th>
                      <th class="text-center pa-0">最高分</th>
                      <th class="text-center pa-0">最低分</th>
                      <th class="text-center pa-0">平均分</th>
                    </tr>
                  </thead>
                  <tbody v-if="item.majorLine">
                    <tr>
                      <td class="px-0">{{item.majorLine.batch}}</td>
                      <td>{{item.majorLine.maxScore}}</td>
                      <td>{{item.majorLine.minScore}}</td>
                      <td>{{item.majorLine.avgScore}}</td>
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
          </university-row-base>
        </v-list>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { withLoading } from "../decorators/with-loading";
import { yearItems } from "./selectOptions";
import { mapGetters } from "vuex";
import { MajorInfo } from "../components/MajorRow.vue";
import html2Canvas from "html2canvas";

import UniversityRowBase, {
    ListItem as UniversityRow
} from "@/components/UniversityRowBase.vue";
import eventBus from "../event-bus";

interface MajorEnsRow {
    id: string;
    majorLine: MajorInfo | null;
    university: UniversityRow;
}

@Component({
    name: "MajorDetail",
    computed: {
        ...mapGetters(["universityTypes", "universityLevels", "areaList"])
    },
    components: {
        UniversityRowBase
    }
})
export default class extends Vue {
    private majorId!: number;
    private followed: boolean = false;
    private majorLogo: string = "";

    private majorInfo: MajorInfo = {
        majorName: "",
        majorID: 0,
        majorCode: "--",
        popular: 0,
        degree: "--",
        eduYear: "--",
        majorClass: "--",
        majorType: "--",
        extraTest: "--",
        genderRate: "--",
        employRate: "--",
        labels: "--",
        briefIntro: "暂无",
        majorContent: "暂无",
        workDirection: "暂无",
        id: "--",
        typeName: "--"
    };

    private tabs: string[] = ["专业简介", "开设院校"];

    private tabIndex: string = "0";

    private showAreaPicker: boolean = false;

    private defaultValue: number[] = [];
    private areaCode: string = "";

    private yearItems = yearItems;

    private universityType = "0|不限";

    private universityLevel = "0|不限";

    private year = new Date().getFullYear() - 1;

    private areaText: string = "";

    private pageIndex: number = 1;

    private majorEnsRows: MajorEnsRow[] = [];

    private filterMajorEnsInfo() {
        this.pageIndex = 1;
        this.getMajorEnstablishInfo();
    }

    private onBottomTouchUp() {
        if (this.tabIndex !== "1") {
            return;
        }
        this.pageIndex++;
        this.getMajorEnstablishInfo(1);
    }

    // mode 0: 刷新 1：添加
    @withLoading()
    private async getMajorEnstablishInfo(mode: 0 | 1 = 0) {
        const rsp = await this.$http.get<ResponseModel<MajorEnsRow[]>>(
            "/api/Universitys/GetMajorUniverSityPageList",
            {
                params: {
                    MajorID: this.majorId,
                    Year: this.year,
                    AreaCode: this.areaCode,
                    EduClass: this.universityType,
                    EduType: this.universityLevel,
                    PageIndex: this.pageIndex,
                    PageSize: 10,
                    Where: ""
                }
            }
        );

        if (mode === 0) {
            this.majorEnsRows = rsp.data.data;
        } else {
            this.majorEnsRows.push(...rsp.data.data);
        }
    }

    private onAreaChange(res: AreaTree[], isEnsure: boolean) {
        if (!isEnsure) {
            return;
        }

        this.areaText = res.map((item) => item.label).join("");
        this.defaultValue = res.map((item) => item.value);
        this.areaCode = res[res.length - 1].code!;
        this.filterMajorEnsInfo();
    }

    private created() {
        eventBus.$on("bottomScrollUp", this.onBottomTouchUp);
        const route = this.$route;
        this.majorId = parseInt(route.params.id, 10);
        this.getMajorFollowedInfo();
        this.getMajorDetail();
        this.getMajorEnstablishInfo();
    }

    private async getMajorFollowedInfo() {
        const rsp = await this.$http.get<ResponseModel<string>>(
            "/api/MajorCollections/JudgeCollected",
            {
                params: {
                    schoolid: this.majorId
                }
            }
        );

        this.followed = JSON.parse(rsp.data.data);
    }

    private calculatePolular(popular: number): number {
        if (popular <= 0) {
            return 0;
        }

        const lg10 = Math.log10(popular);

        return lg10 > 5 ? 5 : Math.ceil(lg10);
    }

    private async getMajorDetail() {
        const rsp = await this.$http.get<ResponseModel<MajorInfo[]>>(
            "/api/MajorInfos/GetMajorInfo",
            {
                params: {
                    majorid: this.majorId
                }
            }
        );

        const [majorInfo] = rsp.data.data;
        if (majorInfo) {
            this.majorInfo = majorInfo;
        }
    }

    @withLoading()
    private async followMajor() {
        try {
            if (!this.followed) {
                await this.$http.post(
                    "/api/MajorCollections/SetCollect",
                    this.majorId,
                    {
                        headers: {
                            "content-type": "application/json-patch+json"
                        }
                    }
                );
            } else {
                await this.$http.delete("/api/MajorCollections/CancleCollect", {
                    data: this.majorId,
                    headers: {
                        "content-type": "application/json-patch+json"
                    }
                });
            }

            this.followed = !this.followed;
        } catch (ex) {
            //
        }
    }

    // private async saveImage() {
    //     const image = new Image();

    //     image.src = "/static/img/logo.png";

    //     image.onload = function() {
    //         const { naturalHeight, naturalWidth } = image;
    //         const scale = window.screen.availWidth / image.naturalWidth;

    //         html2Canvas(document.querySelector("#saveContent") as HTMLElement, {
    //             ignoreElements(elements) {
    //                 return (
    //                     elements.id === "saveButton" || elements.id === "header"
    //                 );
    //             },
    //             onclone(document) {
    //                 console.log(document);
    //             },
    //             y: -(naturalHeight * scale + 20),
    //             height: window.screen.availHeight + naturalHeight * scale + 20
    //         }).then((canvas: HTMLCanvasElement) => {
    //             canvas.id = "wxSaveImageToPhoto";

    //             const ctx = canvas.getContext("2d");
    //             if (ctx) {
    //                 ctx.translate(0, -(naturalHeight * scale + 20));
    //                 ctx.drawImage(
    //                     image,
    //                     0,
    //                     0,
    //                     naturalWidth * scale,
    //                     naturalHeight * scale
    //                 );
    //             }

    //             const tag = document.createElement("a");
    //             tag.download = "测评结果.png"
    //             tag.href = canvas.toDataURL();
    //             tag.click();
    //         });
    //     };
    // }
}
</script>