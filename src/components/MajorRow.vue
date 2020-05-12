<template>
  <v-list-item class="pa-0 mb-2" @click="goDetail(item.majorID)">
    <v-card width="100%" class="d-flex pl-2 pr-2">
      <div class="d-flex align-center">
        <v-list-item-avatar color="secondary" size="50">
          <span class="white--text">{{item.majorName.substring(0,1)}}</span>
        </v-list-item-avatar>
      </div>
      <v-list-item-content>
        <v-list-item-title class="d-flex justify-space-between align-center row no-gutters">
          <span class="col-6 text-truncate">{{item.majorName}}</span>
          <span class="col-6">
            <span class="caption mr-2">人气</span>
            <v-icon
              class="mb-1"
              small
              color="red"
              v-for="item in calculatePolular(item.popular)"
              :key="item"
            >whatshot</v-icon>
          </span>
          <!-- <span class="body-2">{{item.provinceName}}</span> -->
        </v-list-item-title>
        <v-list-item-content class="pa-0 pt-1">
          <v-row no-gutters class="caption">
            <v-col class cols="6" sm="4">
              <span>-</span>
              <span class="mx-1">{{item.eduYear}}</span>
              <span>{{item.degree}}</span>
            </v-col>
            <v-col class="blue--text" cols="6" sm="5">{{item.popular}}</v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item-content>
      <advisory-btn @click.native.stop :typeCode="2" class="mt-4 mx-1"></advisory-btn>
    </v-card>
  </v-list-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
export interface MajorInfo {
    majorID: number;
    majorName: string;
    majorCode: string;
    popular: number;
    degree: string;
    eduYear: string;
    majorClass: string;
    majorType: string;
    extraTest: string;
    genderRate: string;
    employRate: string;
    labels: string;
    briefIntro: string;
    majorContent: string;
    workDirection: string;
    id: string;
}
@Component
export default class extends Vue {
    @Prop() private item!: MajorInfo;
    private calculatePolular(popular: number): number {
        if (popular <= 0) {
            return 0;
        }

        const lg10 = Math.log10(popular);

        return lg10 > 5 ? 5 : Math.ceil(lg10);
    }

    private goDetail(id: number) {
        this.$router.push(`/major/detail/${id}`);
    }
}
</script>