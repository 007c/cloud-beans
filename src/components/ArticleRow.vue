<template>
  <v-list-item class="pa-0 mb-2" :to="'/class/' + item.articleID">
    <v-card class="pa-2 d-flex justify-space-between row align-center no-gutters" width="100%">
      <v-list-item-content class="pa-0">
        <v-row no-gutters>
          <v-list-item-title class="subtitle-2">{{item.title}}</v-list-item-title>
        </v-row>
        <v-row no-gutters class="caption mt-1">
          <v-col cols="5">{{toDateTime(item.pubTime)}}</v-col>
          <v-col cols="2">文章</v-col>
          <v-col cols="5">{{item.readCount}}阅读</v-col>
        </v-row>
      </v-list-item-content>
      <div class="col-3 pa-0">
        <v-img width="100%" :src="item.imgUrl"></v-img>
      </div>
    </v-card>
  </v-list-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { startAsyncGuide } from "../loginGuideController";
import { ClassItem } from "../views/classes";
import moment from 'moment';
@Component({
    name: "ArticleRow"
})
export default class extends Vue {
    @Prop() private item!: ClassItem;
    private toDateTime(pubTime: string) {
        return moment(pubTime).format("MM-DD HH:mm");
    }
}
</script>