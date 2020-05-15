<template>
  <v-container>
    <!-- <v-row no-gutters>
      <v-col cols="2">
        <v-btn @click="$router.go(-1)" icon color="primary">
          <v-icon>arrow_back</v-icon>
        </v-btn>
      </v-col>
      <v-col class="d-flex align-center justify-center">
        <h1 class="primary--text subtitle-1 text-center font-weight-bold">院校查询</h1>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>-->
    <!-- <header-bar title="院校查询"></header-bar>
    <v-divider></v-divider>-->
    <v-row>
      <v-col class="pl-6 pr-6">
        <v-text-field
          height="15px"
          hide-details
          dense
          outlined
          append-icon="search"
          placeholder="请输入院校名称"
          v-model="universityName"
          @click:append="searchList"
        ></v-text-field>
      </v-col>
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
      <university-row :item="item" v-for="item in listData" :key="item.id"></university-row>
    </v-list>
    <v-subheader v-show="shoudShowNoDataTip" class="justify-center">没有更多数据了</v-subheader>
  </v-container>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import eventBus from "../event-bus";
import { mapGetters } from "vuex";
import { withLoading } from "@/decorators/with-loading";
import UniversityRow from "../components/UniversityRow.vue";
import { ListItem } from "../components/UniversityRowBase.vue";

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
        UniversityRow
    },
    computed: {
        ...mapGetters(["universityTypes", "universityLevels", "areaList"])
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

    private created() {
        if (this.$route.query.query) {
            this.universityName = this.$route.query.query as string;
        }
        this.getListData();
        eventBus.$on("bottomScrollUp", this.onBottomTouchUp);
    }

    private beforeDestroy() {
        eventBus.$off("bottomScrollUp", this.onBottomTouchUp);
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
            "/api/Universitys/GetPageList",
            {
                params: {
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