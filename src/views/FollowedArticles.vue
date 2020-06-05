<template>
  <v-container>
    <v-list>
      <article-row v-for="item in articleList" :key="item.articleID" :item="item"></article-row>
    </v-list>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import ArticleRow from "../components/ArticleRow.vue";
import { ClassItem } from "./classes";

@Component({
    components: {
        ArticleRow
    }
})
export default class extends Vue {
    private articleList: ClassItem[] = [];

    private created() {
        this.getFollowedArticles();
    }

    private async getFollowedArticles() {
        const rsp = await this.$http.get<ResponseModel<ClassItem[]>>(
            "/api/Articles/GetCollectPageList",
            {
                params: {
                    PageIndex: 1,
                    PageSize: 1000,
                    Where: ""
                }
            }
        );

        this.articleList = rsp.data.data;
    }
}
</script>