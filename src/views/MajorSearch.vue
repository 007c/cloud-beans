<style lang="less" scoped>
.border-right {
    border-right: 1px solid #eee;
}
</style>

<template>
  <v-container style="height:100%">
    <header-bar title="专业查询"></header-bar>
    <v-divider></v-divider>
    <v-row>
      <v-col class="pl-6 pr-6">
        <v-text-field
          height="15px"
          hide-details
          dense
          outlined
          append-icon="search"
          placeholder="请输入专业名称"
          v-model="majorName"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-tabs grow v-model="tabIndex">
      <v-tab v-for="name in tabs" :key="name">{{name}}</v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <v-tabs-items v-model="tabIndex" class="fill-height">
      <v-tab-item
        v-for="(treeItems, index) in [majorTree, juniorMajorTree]"
        :key="index"
        class="fill-height"
      >
        <v-row class="fill-height">
          <v-col class="pt-0 pd-0 pr-0">
            <v-list class="border-right fill-height">
              <v-list-item-group color="primary" v-model="itemIndex">
                <v-list-item
                  @click="switchTree(index)"
                  v-for="(item, index) in treeItems"
                  :key="item.id"
                  style="min-height: auto"
                >
                  <v-list-item-content class="pa-2">
                    <v-list-item-title class="text-center body-2">{{item.text}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
          <v-col class="pt-0 pd-0 pl-0">
            <v-treeview
              class="body-2"
              return-object
              @update:active="onTreeActive"
              hoverable
              dense
              activatable
              :items="subTree"
              item-text="text"
            ></v-treeview>
          </v-col>
        </v-row>
      </v-tab-item>
      <!-- <v-tab-item class="fill-height">
        <v-row class="fill-height">
          <v-col class="pt-0 pd-0 pr-0">
            <v-list class="border-right fill-height">
              <v-list-item-group color="primary" v-model="itemIndex">
                <v-list-item @click="switchSubTree(index)" v-for="(item, index) in juniorMajorItems" :key="item.id" style="min-height: auto">
                  <v-list-item-content class="pa-2">
                    <v-list-item-title class="text-center body-2">{{item.text}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
          <v-col class="pt-0 pd-0 pl-0">
            <v-treeview
              class="body-2"
              return-object
              @update:active="onTreeActive"
              hoverable
              dense
              activatable
              :items="treeItems"
              item-text="text"
            ></v-treeview>
          </v-col>
        </v-row>
      </v-tab-item>-->
    </v-tabs-items>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { withLoading } from "@/decorators/with-loading";

interface TreeView {
    text: string;
    id: number;
    levels: number;
    children?: TreeView[];
}

@Component({
    name: "MajorSearch"
})
export default class extends Vue {
    private majorName: string = "";
    private itemIndex: number = 0;
    private tabs: string[] = ["本科", "专科"];
    private majorTree: TreeView[] = [];
    private juniorMajorTree: TreeView[] = [];
    private subMajorTree: TreeView[] = [];
    private juniorSubMajorTree: TreeView[] = [];
    private tabIndex = 0;
    private subIndex = 0;

    private async created() {
        this.majorTree = await this.getMajorTree(1);
        this.juniorMajorTree = await this.getMajorTree(2);
    }

    get subTree(): TreeView[] {
        let sourceTree: TreeView[];
        if (this.tabIndex === 0) {
            sourceTree = this.majorTree;
        } else {
            sourceTree = this.juniorMajorTree;
        }

        return sourceTree[this.subIndex]?.children || [];
    }

    private onTreeActive([params]: TreeView[]) {
        if (params.levels !== 3) {
            return;
        }
        this.$router.push(`/major/detail/${params.id}`);
    }

    private switchTree(index: number) {
        this.subIndex = index;
    }

    @withLoading()
    private async getMajorTree(typeId: 1 | 2) {
        interface TreeData {
            id: number;
            text: string;
            levels: number;
            children: TreeData[];
        }
        const ret = await this.$http.get<ResponseModel<TreeData[]>>(
            "/api/MajorTrees/GetMajorTree",
            {
                params: {
                    typeid: typeId
                }
            }
        );

        return ret.data.data;

        // const transformTree = function(treeData: TreeData[]): TreeView[] {
        //   const treeItems: TreeView[] = [];

        //   for(const item of treeData) {
        //     const treeItem: TreeView = {
        //       id: item.id,
        //       name: treeItem.text
        //     }
        //   }
        //   return treeItems;
        // }
    }
}
</script>