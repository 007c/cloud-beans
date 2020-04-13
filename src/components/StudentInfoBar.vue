<template>
  <v-row
    justify="center"
    align="center"
    no-gutters
    class="text-center justify-center mt-2 mr-2 ml-2 caption"
  >
    <v-col v-for="(item, index) in barItems" :key="index">
      <v-icon color="primary">{{item.icon}}</v-icon>
      <span class="text-truncate ml-1">{{item.label || "--"}}</span>
    </v-col>
    <v-col cols="2">
      <v-btn class="pa-0" to="/grade/edit" text color="secondary">编辑</v-btn>
      <!-- <v-btn v-else to="/login" text color="secondary">登录</v-btn> -->
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

interface Slider {
    imgUrl: string;
}

interface BarItem {
    icon: string;
    label?: string | number | null;
}

import { StudentInfo, Subject } from "@/store/use-state";

@Component({
    name: "StudentInfoBar"
})
export default class extends Vue {
    private barItems: BarItem[] = [];
    private created() {
        const { studentInfo } = this;
        this.barItems = [
            {
                icon: "location_on",
                label: studentInfo.province
            },
            {
                icon: "subject",
                label: studentInfo.subject != null ? Subject[studentInfo.subject] : null
            },
            {
                icon: "book",
                label: studentInfo.grade
            },
            {
                icon: "people",
                label: studentInfo.rank || "-- " + " 名"
            }
        ];
    }
    get studentInfo(): StudentInfo {
        return this.$store.state.userState.studentInfo;
    }

    get isLogin(): boolean {
        return this.$store.state.userState.isLogin;
    }
}
</script>