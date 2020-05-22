<template>
  <v-container>
    <header-bar :followed="followed" title="高考课堂" with-follow></header-bar>
    <v-divider></v-divider>
    <v-subheader class="pl-0">{{classItem.title}}</v-subheader>
    <v-row class="caption" no-gutters>
      <v-col class="pa-0">来源：高考在线</v-col>
      <v-col class="pa-0 text-center">1000 阅读</v-col>
      <v-col class="pa-0 text-center">10 收藏</v-col>
      <v-col class="pa-0 text-center">2020-03-14</v-col>
    </v-row>
    <div v-html="templateHtml"></div>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { ClassItem, classes } from "./classes";
import { loadArticleTemplate } from '../util/static-loader';

@Component({
    name: "ClassDetail"
})
export default class extends Vue {
    private followed: boolean = false;
    private articleId!: number;

    private classItem!: ClassItem;
    private templateHtml: string = "";

    private created() {
        const articleId = parseInt(this.$route.params.id, 10);
        this.classItem = classes.find((item) => item.id === articleId)!;
        this.articleId = articleId;

        this.loadArticle(this.classItem.template);
    }

    private async loadArticle(template: string) {
      const rsp = await loadArticleTemplate(template);
      this.templateHtml = rsp.data;
    }
}
</script>