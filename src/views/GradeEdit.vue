<style lang="less" scoped>
.check-radio {
    width: 50%;
}
</style>
<template>
  <v-container>
    <!-- <v-row no-gutters>
      <v-col cols="2">
        <v-btn @click="$router.go(-1)" icon color="primary">
          <v-icon>arrow_back</v-icon>
        </v-btn>
      </v-col>
      <v-col class="d-flex align-center justify-center">
        <h1 class="primary--text subtitle-1 text-center font-weight-bold">成绩编辑</h1>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>-->
    <header-bar title="成绩编辑"></header-bar>
    <v-divider></v-divider>
    <v-form class="mt-4 pl-2" ref="gradeForm">
      <v-row align="center" class="body-1">
        <v-col cols="3" class="pr-0">
          <v-icon>location_on</v-icon>
          <span class="ml-1">生源</span>
        </v-col>
        <v-col class="pr-4">
          <v-text-field
            v-model="areaText"
            dense
            hide-details
            readonly
            outlined
            tile
            @click="showAreaPicker = true"
          ></v-text-field>
          <Picker
            :defaultValue="defaultValue"
            @onChange="onAreaChange"
            @update:show="showAreaPicker=false"
            :list="supportAreaList"
            :isRelate="true"
            :isMulti="true"
            :show="showAreaPicker"
          ></Picker>
        </v-col>
      </v-row>
      <v-row align="center" class="body-1">
        <v-col cols="3" class="pr-0">
          <v-icon>location_on</v-icon>
          <span class="ml-1">高中</span>
        </v-col>
        <v-col class="pr-4">
          <v-text-field
            v-model="highSchoolText"
            dense
            hide-details
            readonly
            outlined
            tile
            @click="showHighSchoolPicker = true"
          ></v-text-field>
          <Picker
            :defaultValue="defaultHighSchool"
            @onChange="onSchoolChange"
            @update:show="showHighSchoolPicker=false"
            :list="highSchoolList"
            :show="showHighSchoolPicker"
          ></Picker>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col class="pr-0" cols="3">
          <v-icon>subject</v-icon>
          <span class="ml-1">科目</span>
        </v-col>
        <v-col class="pr-4">
          <v-radio-group v-model="subject" :column="false">
            <v-radio :value="1" label="文科"></v-radio>
            <v-radio class="ml-8" :value="2" label="理科"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col class="pr-0" cols="3">
          <v-icon>book</v-icon>
          <span class="ml-1">考分</span>
        </v-col>
        <v-col class="pr-4">
          <v-text-field
            :validate-on-blur="false"
            placeholder="请输入总分[100-750]"
            :rules="[validateGrade]"
            v-model="grade"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col class="pr-0" cols="3">
          <v-icon>people</v-icon>
          <span class="ml-1">排名</span>
        </v-col>
        <v-col class="pr-4">
          <v-text-field placeholder="本省排名（非必填）" :rules="[validateRank]" v-model="rank"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn @click="submitGradeForm" block color="primary">开始择校</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { withLoading } from "../decorators/with-loading";
import { UPDATE_STUDENT_INFO, UPDATE_USER_INFO } from "@/store/mutation-types";
import { StudentInfo, Subject, UserInfo } from "../store/use-state";

@Component({
    name: "GradeEdit"
})
export default class extends Vue {
    private showAreaPicker: boolean = false;
    private showHighSchoolPicker: boolean = false;
    private defaultValue = [1, 3];
    private areaText: string = "";
    private highSchoolText: string = "";
    private province: string = "";
    private subject: Subject = Subject.文科;
    private defaultHighSchool: number = 0;
    private grade: string = "";

    private rank: string = "";

    private highSchoolList: AreaTree[] = [];

    private created() {
        this.initForm();
    }

    get areaList(): AreaTree[] {
        return this.$store.getters.areaList;
    }
    get supportAreaList(): AreaTree[] {
        return this.areaList.filter((item) => item.value === 510000);
    }
    get areaMap(): Dict<string> {
        const map: Dict<string> = {};
        for (const item of this.areaList) {
            map[item.value] = item.label;
        }
        return map;
    }
    get isLogin() {
        return this.$store.getters.isLogin;
    }

    get studentInfo(): StudentInfo {
        return this.$store.state.userState.studentInfo;
    }

    get userInfo(): UserInfo {
        return this.$store.state.userState.userInfo;
    }

    @Watch("studentInfo", { deep: true })
    @Watch("areaList")
    private initForm() {
        const {
            province,
            grade,
            subject,
            rank,
            provinceCode,
            highSchoolId
        } = this.studentInfo;
        this.areaText = this.areaMap[provinceCode!]; // source || "";
        this.subject = subject || 0;
        this.grade = grade as string;
        this.rank = rank as string;
        this.defaultValue = [provinceCode!];
        this.defaultHighSchool = highSchoolId!;
        this.getHighSchoolByArea(provinceCode!);
    }

    @withLoading()
    private async getHighSchoolByArea(areaCode: number) {
        const rsp = await this.$http.get<
            ResponseModel<
                Array<{
                    firstArea: string;
                    firstAreaCode: number;
                    fullName: string;
                    schoolID: number;
                    secondArea: string;
                    secondAreaCode: number;
                    thridArea: string;
                    thridAreaCode: number;
                }>
            >
        >("/api/HighSchools/GetHighSchools", {
            params: {
                areaCode
            }
        });

        const { data } = rsp.data;

        this.highSchoolList = data.map(
            (item): AreaTree => {
                if (item.schoolID === this.defaultHighSchool) {
                    this.highSchoolText = item.fullName;
                }
                return {
                    label: item.fullName,
                    value: item.schoolID
                };
            }
        );
    }

    private onSchoolChange([item]: AreaTree[]) {
        this.defaultHighSchool = item.value;
        this.highSchoolText = item.label;
    }

    private async onAreaChange(res: AreaTree[], isEnsure: boolean) {
        if (!isEnsure) {
            return;
        }
        this.defaultValue = res.map((item) => item.value);
        this.areaText = res.map((item) => item.label).join("");
        this.province = res[0].label;
        const city = res[res.length - 1];
        this.highSchoolText = "";

        if (city) {
            await this.getHighSchoolByArea(city.value);
            const { highSchoolList } = this;
            if (highSchoolList[0]) {
                this.defaultHighSchool = highSchoolList[0].value;
                this.highSchoolText = highSchoolList[0].label;
            }
        }
    }

    private validateGrade(grade: string): boolean | string {
        return (
            (/^[1-7][0-9]{2}$/.test(grade) && parseInt(grade, 10) <= 750) ||
            "请输入范围在100-750的分数"
        );
    }

    private validateRank(rank: string): boolean | string {
        return !rank || /^[1-9][0-9]*$/.test(rank) || "请输入正确的排名";
    }

    @withLoading()
    private async submitGradeForm() {
        const gradeForm: any = this.$refs.gradeForm;

        if (!gradeForm.validate()) {
            return;
        }

        const { originalInfo } = this.userInfo;

        const gradeModel: GradeInfoModel = {
            ...originalInfo!,
            rank: parseInt(this.rank, 10),
            score: parseInt(this.grade, 10),
            divisionTypeID: this.subject,
            divisionType: Subject[this.subject],
            provinceCode: this.defaultValue[0],
            highSchoolID: this.defaultHighSchool
        };

        const studentInfo: StudentInfo = {
            rank: this.rank,
            grade: this.grade,
            source: this.areaText,
            subject: this.subject,
            highSchoolId: this.defaultHighSchool,
            provinceCode: this.defaultValue[0]
        };

        const userInfo: UserInfo = {
            originalInfo: gradeModel
        };

        try {
            this.$http.put("/api/UserScoreRank/Update", gradeModel);
            this.$store.commit(UPDATE_STUDENT_INFO, studentInfo);
            this.$store.commit(UPDATE_USER_INFO, userInfo);
            this.$router.push("/choice");
        } catch (ex) {
            // console.log("ex: ", ex);
        }
    }
}
</script>