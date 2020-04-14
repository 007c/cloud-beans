<template>
  <v-container>
    <header-bar :followed="followed" title="高考课堂" with-follow @follow="followClass"></header-bar>
    <v-divider></v-divider>
    <v-subheader class="pl-0">{{classItem.title}}</v-subheader>
    <v-row class="caption" no-gutters>
      <v-col class="pa-0">来源：高考在线</v-col>
      <v-col class="pa-0 text-center">1000 阅读</v-col>
      <v-col class="pa-0 text-center">10 收藏</v-col>
      <v-col class="pa-0 text-center">2020-03-14</v-col>
    </v-row>
    <v-img class="mt-2 mb-2" :src="classItem.imgUrl"></v-img>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.
      Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus pronin sapien nunc accuan eget.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus pronin sapien nunc accuan eget.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod
    </p>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { ClassItem, classes } from "./classes";

@Component({
    name: "ClassDetail"
})
export default class extends Vue {
    private followed: boolean = false;
    private articleId!: number;

    private classItem!: ClassItem;

    private created() {
        const articleId = parseInt(this.$route.params.id, 10);
        this.classItem = classes[articleId];
        this.articleId = articleId;
    }
}
</script>