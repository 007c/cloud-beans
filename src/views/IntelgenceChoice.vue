<template>
  <v-container>
    <!-- <v-row no-gutters>
      <v-col cols="3">
        <v-btn @click="$router.go(-1)" icon color="primary">
          <v-icon>arrow_back</v-icon>
        </v-btn>
      </v-col>
      <v-col class="d-flex align-center justify-center">
        <h1 class="primary--text subtitle-1 text-center font-weight-bold">智能择校</h1>
      </v-col>
      <v-col cols="3">
      </v-col>
    </v-row>
    <v-divider></v-divider> -->

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
          :show="showAreaPicker"
          :isMulti="true"
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
          @change="searchList"
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
          @change="onUniLevelChange"
        ></v-select>
      </v-col>
      <v-col cols="12">
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
          @change="searchList"
        >
          <template v-slot:prepend-item>
            <v-list-item ripple @click="toggle">
              <v-list-item-action>
                <v-icon :color="isAllTagsSelected ? 'primary' : ''">{{ icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>全选</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="mt-2"></v-divider>
          </template>
        </v-select>
      </v-col>
    </v-row>
    <v-list>
      <!-- <university-row :item="item" v-for="item in listData" :key="item.id"></university-row> -->
      <university-row-base :item="item" v-for="item in listData" :key="item.id">
        <template v-slot:default="scope">
          <v-list-item-content>
            <v-row align="center">
              <v-col cols="5" class="pt-0 pb-0">
                <v-list-item-title class="text-truncate">{{scope.item.fullName}}</v-list-item-title>
              </v-col>
              <v-col cols="7" class="pa-0">
                <span class="body-2 mr-2">{{scope.item.provinceName}}</span>
                <span
                  class="body-1"
                  :class="getFontClass(item.probabilityTypeID)"
                >{{scope.item.probabilityType}} {{(scope.item.probability * 100).toFixed(1) + "%"}}</span>
              </v-col>
            </v-row>
            <v-list-item-content class="pa-0">
              <v-row no-gutters class="caption">
                <v-col class cols="3" sm="3">{{normalizeLabels(scope.item.labels)[1]}}</v-col>
                <v-col class cols="9" sm="4">
                  <v-btn
                    outlined
                    color="primary"
                    class="ml-1 mb-1"
                    depressed
                    tile
                    x-small
                    v-for="text in normalizeLabels(scope.item.labels)"
                    :key="text"
                  >{{text}}</v-btn>
                </v-col>
                <v-col class cols="12" sm="5">
                  2019年分数线：
                  <span class="blue--text text--darken-2">{{Math.round(scope.item.lineValue + scope.item.subValue)}}</span>
                  <span class="ml-2">{{scope.item.batch}}</span>
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item-content>
        </template>
      </university-row-base>
    </v-list>
    <v-subheader v-show="shoudShowNoDataTip" class="justify-center">没有更多数据了</v-subheader>
  </v-container>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import eventBus from "../event-bus";
import { mapGetters } from "vuex";
import { withLoading } from "@/decorators/with-loading";
import UniversityRow from "../components/UniversityRow.vue";
import { StudentInfo } from "../store/use-state";
import StudentInfoBar from "@/components/StudentInfoBar.vue";
import UniversityRowBase, {
    ListItem
} from "../components/UniversityRowBase.vue";
import { Route } from "vue-router";

const findTreePath = function(tree: AreaTree[], nodeValue: number) {
    const path: AreaTree[] = [];
    function find(treeNode: AreaTree[] | undefined) {
        if (!treeNode) {
            return false;
        }

        for (const item of treeNode) {
            const ret = find(item.children);
            if (item.value === nodeValue) {
                path.push(item);
                return true;
            }
            if (ret || item.value === nodeValue) {
                path.push(item);
            }
        }

        return false;
    }

    find(tree);
    return path;
};

@Component({
    name: "universitySearch",
    components: {
        UniversityRow,
        StudentInfoBar,
        UniversityRowBase
    },
    computed: {
        ...mapGetters(["universityTypes", "universityLevels", "areaList"])
    },
    beforeRouteEnter(
        to: Route,
        from: Route,
        next: (fn: (vm: any) => void) => void
    ) {
        next((vm) => {
            if (!vm.studentInfo.grade) {
                vm.$router.replace("/grade/edit");
            }
        });
    }
})
export default class extends Vue {
    private universityName: string = "";
    private showAreaPicker: boolean = false;

    private defaultValue: number[] = [];

    private areaText: string = "全部";

    private areaCode: string = "";

    private universityType = "0|不限";

    private universityLevel = "0|不限";

    private universityTag: string[] = [];

    private listData: ListItem[] = [];

    private pageIndex: number = 1;

    private pageSize: number = 10;

    private shoudShowNoDataTip = false;
    get universityTags(): Array<SelectOption<string>> {
        // level to tags map
        const {
            universityTags,
            juniorTas,
            undergraduateTags
        } = this.$store.getters;
        const uniTagsMap: Dict<Array<SelectOption<string>>> = {
            0: universityTags,
            1: juniorTas,
            2: undergraduateTags
        };
        const uniLevelCode = this.universityLevel.split("|")[0];
        return uniTagsMap[uniLevelCode];
    }

    private onUniLevelChange() {
        this.universityTag = [];
        this.searchList();
    }

    get studentInfo(): StudentInfo {
        return this.$store.state.userState.studentInfo;
    }

    get icon() {
        if (this.isAllTagsSelected) {
            return "check_box";
        }
        // if (this.universityTag.length > 0) return "indeterminate_check_box";
        return "check_box_outline_blank";
    }

    get isAllTagsSelected() {
        return this.universityTag.length === this.universityTags.length;
    }

    private toggle() {
        if (this.isAllTagsSelected) {
            this.universityTag = [];
        } else {
            this.universityTag = this.universityTags.map((item) => item.value);
        }

        this.searchList();
    }

    private normalizeLabels(labels: string): string[] {
        return labels.split(",").slice(0, 4);
    }

    private created() {
        eventBus.$on("bottomScrollUp", this.onBottomTouchUp);
    }

    private activated() {
        this.searchList();
    }

    private beforeDestroy() {
        eventBus.$off("bottomScrollUp", this.onBottomTouchUp);
    }

    private getFontClass(priorId: number) {
        const priorToTextClassMap: Dict<string> = {
            1: "green--text",
            2: "blue--text",
            3: "red--text"
        };

        return priorToTextClassMap[priorId] || "text--grey";
    }

    private searchList() {
        this.pageIndex = 1;
        this.getListData();
    }

    private onBottomTouchUp() {
        // console.log("bottom touch up")
        this.pageIndex++;
        this.getListData("push");
    }

    private onAreaChange(res: AreaTree[], isEnsure: boolean) {
        if (!isEnsure) {
            return;
        }
        this.defaultValue = res.map((item) => item.value);

        this.areaText = res.map((item) => item.label).join("");
        this.areaCode = res[res.length - 1].code!;
        this.searchList();
    }

    @withLoading()
    private async getListData(mode: "push" | "reload" = "reload") {
        const labels = this.universityTag.map((item) => {
            const values = item.split("|");
            return {
                value: parseInt(values[0], 10),
                text: values[1]
            };
        });

        labels.sort((a, b) => a.value - b.value);
        const tags = labels.map((item) => `${item.value}|${item.text}`);
        const rsp = await this.$http.get<ResponseModel<ListItem[]>>(
            "/api/Universitys/GetSuggetPageList",
            {
                params: {
                    Score: this.studentInfo.grade,
                    PageIndex: this.pageIndex,
                    PageSize: this.pageSize,
                    FullName: this.universityName,
                    EduType: this.universityLevel,
                    EduClass: this.universityType,
                    Labels: tags.join(","),
                    AreaCode: this.areaCode
                }
            }
        );

        const { data } = rsp.data;
        if (data.length < this.pageSize) {
            this.shoudShowNoDataTip = true;
        } else {
            this.shoudShowNoDataTip = false;
        }

        if (mode === "push") {
            this.listData.push(...data);
        } else {
            this.listData = data;
        }
    }
}
</script>