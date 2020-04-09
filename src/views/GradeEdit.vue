<style lang="less" scoped>
.check-radio {
    width: 50%;
}
</style>
<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="2">
        <v-btn @click="$router.go(-1)" icon color="primary">
          <v-icon>arrow_back</v-icon>
        </v-btn>
      </v-col>
      <v-col class="d-flex align-center justify-center">
        <h1 class="primary--text subtitle-1 text-center font-weight-bold">成绩编辑</h1>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
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
            :list="areaList"
            :isRelate="true"
            :isMulti="true"
            :show="showAreaPicker"
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
            <v-radio :value="0" label="文科"></v-radio>
            <v-radio class="ml-8" :value="1" label="理科"></v-radio>
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
import { Vue, Component, Prop } from "vue-property-decorator";
import { withLoading } from "../decorators/with-loading";
import { UPDATE_STUDENT_INFO } from "@/store/mutation-types";
import { StudentInfo, Subject } from "../store/use-state";

@Component({
    name: "GradeEdit"
})
export default class extends Vue {
    private showAreaPicker: boolean = false;
    private defaultValue = [1, 3];
    private areaText: string = "四川成都";
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

    private province: string = "";
    private subject: Subject = Subject.文科;

    private grade: string = "";

    private rank: string = "";

    private created() {
        this.initForm();
    }

    get studentInfo(): StudentInfo {
        return this.$store.state.userState.studentInfo;
    }

    private initForm() {
        const { province, grade, subject, source, rank } = this.studentInfo;
        this.areaText = source || "";
        this.subject = subject || 0;
        this.grade = grade as string;
        this.rank = rank as string;
    }

    private onAreaChange(res: AreaTree[], isEnsure: boolean) {
        if (!isEnsure) {
            return;
        }
        this.defaultValue = res.map((item) => item.value);
        this.areaText = res.map((item) => item.label).join("");
        this.province = res[0].label;
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

        await new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });

        const studentInfo: StudentInfo = {
            rank: this.rank,
            grade: this.grade,
            source: this.areaText,
            province: this.province,
            subject: this.subject
        };

        this.$store.commit(UPDATE_STUDENT_INFO, studentInfo);
        this.$router.push("/choice");
    }
}
</script>