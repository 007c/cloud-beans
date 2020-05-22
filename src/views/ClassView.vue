<style lang="less" scoped>
.img {
    width: 2rem;
}
</style>
<template>
  <v-container>
    <header-bar title="高考课堂"></header-bar>
    <v-divider></v-divider>
    <v-tabs class="mt-4" grow v-model="tabIndex">
      <v-tab v-for="item in tabs" :key="item">{{item}}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabIndex">
      <v-tab-item v-for="(item, index) in tabs" :key="index">
        <v-list>
          <v-list-item
            class="pa-0 mb-2"
            v-for="(item) in filterdClasses(index)"
            :key="item.id"
            :to="'/class/' + item.id"
          >
            <v-card
              class="pa-2 d-flex justify-space-between row align-center no-gutters"
              width="100%"
            >
              <v-list-item-content class="pa-0">
                <v-row no-gutters>
                  <v-list-item-title class="subtitle-2">{{item.title}}</v-list-item-title>
                </v-row>
                <v-row no-gutters class="caption mt-1">
                  <v-col cols="5">04-01 12:00:00</v-col>
                  <v-col cols="2">文章</v-col>
                  <v-col cols="5">1041阅读</v-col>
                </v-row>
              </v-list-item-content>
              <div class="col-3 pa-0">
                <v-img width="100%" :src="item.imgUrl"></v-img>
              </div>
            </v-card>
          </v-list-item>
        </v-list>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { ClassItem, classes } from "./classes";

@Component({
    name: "ClassView"
})
export default class extends Vue {
    private tabs: string[] = ["志愿填报", "高考动态", "院校专业"];
    private tabIndex: number = 0;
    private classes: ClassItem[] = classes;

    private filterdClasses(category: number): ClassItem[] {
        return this.classes.filter((item) => item.category === category);
    }
}
</script>
