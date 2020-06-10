<template>
  <v-container v-if="classItem">
    <header-bar :followed="followed" title="高考课堂" with-follow @follow="onArticleFollow"></header-bar>
    <v-divider></v-divider>
    <v-subheader class="pl-0">{{classItem.title}}</v-subheader>
    <v-row class="caption" no-gutters>
      <v-col class="pa-0">来源：前途问路</v-col>
      <v-col class="pa-0 text-center">{{classItem.readCount}} 阅读</v-col>
      <v-col class="pa-0 text-center">{{classItem.collectCount}} 收藏</v-col>
      <v-col class="pa-0 text-center">{{toDateTime(classItem.pubTime)}}</v-col>
    </v-row>
    <div v-if="classItem.contentTypeID===1" v-html="templateHtml"></div>
    <v-img v-else :src="classItem.contentUrl"></v-img>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { ClassItem } from "./classes";
import { loadArticleTemplate } from "../util/static-loader";
import { withLoading } from "../decorators/with-loading";
import moment from "moment";

@Component({
  name: "ClassDetail"
})
export default class extends Vue {
  private followed: boolean = false;
  private articleId!: number;

  private classItem: ClassItem | null = null;
  private templateHtml: string = "";

  private created() {
    const articleId = parseInt(this.$route.params.id, 10);
    this.articleId = articleId;
    this.getFollowedStatus();
    this.getArticleDetail();
  }

  private toDateTime(pubTime: string) {
    return moment(pubTime).format("MM-DD HH:mm");
  }

  @withLoading()
  private async getArticleDetail() {
    const rsp = await this.$http.get<ResponseModel<ClassItem>>(
      "/api/Articles/GetModel",
      {
        params: {
          articleID: this.articleId
        }
      }
    );

    this.classItem = rsp.data.data;
    this.classItem.contentTypeID === 1 &&
      this.loadArticle(this.classItem.contentUrl);
  }

  private async loadArticle(template: string) {
    const rsp = await loadArticleTemplate(template);
    this.templateHtml = rsp.data;
  }

  private async loadImg(url: string) {
    const rsp = await this.$http.get(url, {
        responseType: "blob"
    })

    return URL.createObjectURL(rsp.data);
  }

  private async followArticle() {
    await this.$http.post(
      "/api/ArticleCollections/SetCollect",
      this.articleId,
      {
        headers: {
          "content-type": "application/json-patch+json"
        }
      }
    );
  }

  private async cancelFollowArticle() {
    await this.$http.delete("/api/ArticleCollections/CancleCollect", {
      data: this.articleId,
      headers: {
        "content-type": "application/json-patch+json"
      }
    });
  }

  @withLoading()
  private async onArticleFollow() {
    try {
      if (this.followed) {
        await this.cancelFollowArticle();
      } else {
        await this.followArticle();
      }

      this.followed = !this.followed;
    } catch (ex) {
      //
    }
  }

  @withLoading()
  private async getFollowedStatus() {
    const rsp = await this.$http.get<ResponseModel<string>>(
      "/api/ArticleCollections/JudgeCollected",
      {
        params: {
          articleid: this.articleId
        }
      }
    );

    this.followed = JSON.parse(rsp.data.data);
  }
}
</script>