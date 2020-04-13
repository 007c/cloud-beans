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
      <v-tab-item class="fill-height">
        <v-row class="fill-height">
          <v-col class="pt-0 pd-0 pr-0">
            <v-list class="border-right fill-height">
              <v-list-item-group color="primary" v-model="itemIndex">
                <v-list-item v-for="name in majors" :key="name" style="min-height: auto">
                  <v-list-item-content class="pa-2">
                    <v-list-item-title class="text-center body-2">{{name}}</v-list-item-title>
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
            ></v-treeview>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item></v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

interface TreeView {
    name: string;
    id: number;
    children?: TreeView[];
}

@Component({
    name: "MajorSearch"
})
export default class extends Vue {
    private majorName: string = "";
    private itemIndex: number = 0;
    private majors: string[] = ["经济学", "数学", "计算机科学", "贸易学"];
    private tabs: string[] = ["本科", "专科"];
    private treeItems: TreeView[] = [
        {
            name: "金融",
            id: 0,
            children: [
                {
                    name: "百科",
                    id: 2
                }
            ]
        },
        {
            name: "数学",
            id: 3,
            children: [
                {
                    name: "高数",
                    id: 4
                }
            ]
        }
    ];
    private tabIndex = 0;

    private onTreeActive([params]: TreeView[]) {
        this.$router.push(`/major/detail/${params.id}`);
    }
}
</script>