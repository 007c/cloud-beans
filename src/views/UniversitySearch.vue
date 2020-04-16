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
    <header-bar title="院校查询"></header-bar>
    <v-divider></v-divider>
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
          @change="searchList"
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
        ></v-select>
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
import UniversityRow, { ListItem } from "../components/UniversityRow.vue";

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
        ...mapGetters([
            "universityTypes",
            "universityLevels",
            "universityTags",
            "areaList"
        ])
    }
})
export default class extends Vue {
    private universityName: string = "";
    private showAreaPicker: boolean = false;

    private defaultValue: number[] = [];

    private areaText: string = "";

    private universityType = 0;

    private universityLevel = 0;

    private universityTag = [0];

    private listData: ListItem[] = [];

    private pageIndex: number = 1;

    private pageSize: number = 10;

    private shoudShowNoDataTip = false;

    private created() {
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
        this.searchList();
    }

    @withLoading()
    private async getListData(mode: "push" | "reload" = "reload") {
        const rsp = await this.$http.get<ResponseModel<ListItem[]>>(
            "/api/Universitys/GetPageList",
            {
                params: {
                    PageIndex: this.pageIndex,
                    PageSize: this.pageSize,
                    FullName: this.universityName,
                    EduType: this.universityType,
                    Labels: this.universityTag.join(","),
                    AreaCode: this.defaultValue[this.defaultValue.length - 1]
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