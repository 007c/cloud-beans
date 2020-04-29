<template>
  <v-row
    justify="center"
    align="center"
    no-gutters
    class="text-center justify-center mt-2 mr-2 ml-2 caption"
  >
    <v-col v-for="(item, index) in barItems" :key="index">
      <v-icon color="primary">{{item.icon}}</v-icon>
      <span class="text-truncate ml-1">{{item.label || "--"}}{{item.postFix || ''}}</span>
    </v-col>
    <v-col cols="2">
      <v-btn class="pa-0" to="/grade/edit" text color="secondary">编辑</v-btn>
      <!-- <v-btn v-else to="/login" text color="secondary">登录</v-btn> -->
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

interface Slider {
    imgUrl: string;
}

interface BarItem {
    icon: string;
    label?: string | number | null;
    postFix?: string;
}

import { StudentInfo, Subject, UserInfo } from "@/store/use-state";
import { GET_USER_BASE_INFO } from "../store/actions";

@Component({
    name: "StudentInfoBar"
})
export default class extends Vue {
    private barItems: BarItem[] = [];
    private async created() {
        this.initLabelInfo();
    }

    @Watch("isLogin", { immediate: true })
    private async getUserBaseInfo() {
        if (this.isLogin && !this.userInfo.id) {
            await this.$store.dispatch(GET_USER_BASE_INFO);
        }
    }

    get areaList(): AreaTree[] {
        return this.$store.getters.areaList;
    }
    get areaMap(): Dict<string> {
        const map: Dict<string> = {};
        for (const item of this.areaList) {
            map[item.value] = item.label;
        }
        return map;
    }
    @Watch("studentInfo", { deep: true })
    @Watch("areaList")
    private initLabelInfo() {
        const { studentInfo } = this;
        this.barItems = [
            {
                icon: "location_on",
                label: this.areaMap[studentInfo.provinceCode!]
            },
            {
                icon: "subject",
                label:
                    studentInfo.subject != null
                        ? Subject[studentInfo.subject]
                        : null
            },
            {
                icon: "book",
                label: studentInfo.grade || "--",
                postFix: "分"
            },
            {
                icon: "people",
                label: studentInfo.rank || "--",
                postFix: "名"
            }
        ];
    }
    get userInfo(): UserInfo {
        return this.$store.state.userState.userInfo;
    }
    get studentInfo(): StudentInfo {
        return this.$store.state.userState.studentInfo;
    }

    get isLogin(): boolean {
        return this.$store.getters.isLogin;
    }
}
</script>