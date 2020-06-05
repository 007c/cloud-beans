<style lang="less" scoped>
.img {
    width: 2rem;
}
</style>
<template>
  <v-container>
    <header-bar title="高考课堂"></header-bar>
    <v-divider></v-divider>
    <v-tabs class="mt-4" grow v-model="tabValue">
      <v-tab v-for="item in tabs" :key="item.value" :value="item.value">{{item.label}}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabValue">
      <v-tab-item v-for="(tabItem) in tabs" :key="tabItem.value">
        <v-list>
          <article-row v-for="item in filterdClasses(tabItem.value)" :key="item.id" :item="item"></article-row>
        </v-list>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { ClassItem, ArticleTypes } from "./classes";
import moment from "moment";
import ArticleRow from "@/components/ArticleRow.vue";
import { withLoading } from "../decorators/with-loading";

@Component({
    name: "ClassView",
    components: {
        ArticleRow
    }
})
export default class extends Vue {
    private tabs: Array<{ label: string; value: number }> = [
        {
            label: ArticleTypes[1],
            value: ArticleTypes.志愿填报
        },
        {
            label: ArticleTypes[2],
            value: ArticleTypes.高考动态
        },
        {
            label: ArticleTypes[3],
            value: ArticleTypes.院校专业
        }
    ];
    private tabValue: number = 0;
    private classes: ClassItem[] = [];

    private filterdClasses(articleTypeId: number): ClassItem[] {
        return this.classes.filter((item) => item.articleTypeID === articleTypeId);
    }

    private created() {
        this.getArticles();
    }

    @withLoading()
    private async getArticles() {
        const rsp = await this.$http.get<ResponseModel<ClassItem[]>>(
            "/api/Articles/GetPageList",
            {
                params: {
                    ArticleTypeID: ArticleTypes.不限,
                    PageIndex: 1,
                    PageSize: 1000,
                    Where: ""
                }
            }
        );
        this.classes = rsp.data.data;
    }

    private toTime(pubTime: string) {
        return moment(pubTime).format("HH:mm:SS");
    }
}
</script>
