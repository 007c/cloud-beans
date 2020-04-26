<template>
  <v-list-item class="pa-0 mb-2" @click="goDetail(item.schoolID)">
    <v-card width="100%" class="d-flex pl-2 pr-2">
      <div class="d-flex align-center mr-3">
        <v-list-item-avatar color="secondary" size="60">
          <v-img
            v-if="item.hasLogo"
            @error="item.hasLogo=false"
            :alt="item.fullName.substring(0,1)"
            :src="'./static/logo/' + item.fullName + '.jpg'"
          ></v-img>
          <span v-else class="white--text">{{item.fullName.substring(0,1)}}</span>
        </v-list-item-avatar>
      </div>
      <v-list-item-content>
        <v-list-item-title class="d-flex justify-space-between align-center row no-gutters">
          <span class="col-8 text-truncate">{{item.fullName}}</span>
          <span class="col-4">
            <advisory-btn @click.native.stop :typeCode="1"></advisory-btn>
          </span>
          <!-- <span class="body-2">{{item.provinceName}}</span> -->
        </v-list-item-title>
        <v-list-item-content class="pa-0">
          <v-row no-gutters class="caption">
            <v-col class cols="4" sm="3">{{item.provinceName}}</v-col>
            <v-col class cols="8" sm="4">{{item.labels.split(',').slice(0, 3).join(' ')}}</v-col>
            <v-col class cols="12" sm="5">热度： {{item.popularity}}</v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item-content>
    </v-card>
  </v-list-item>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
export interface ListItem {
    // logo: string;
    // university: string;
    // id: number;
    schoolID: number;
    fullName: string;
    englishName: string | null;
    provinceName: string;
    provinceCode: number;
    areaName: string;
    areaCode: number;
    eduType: number;
    eduTypeName: string;
    hotOrder: number;
    typeHotOrder: number;
    popularity: number;
    labels: string;
    siteUrl: string;
    tels: string;
    email: string;
    // "doctorStation": 55,
    // "masterStation": 63,
    // "keySubject": 39,
    // "keyLab": 61,
    // "createYear": 1911,
    // "floorArea": 5886,
    // "belongTo": "教育部",
    id: string;
    hasLogo: boolean;
}
@Component({
    name: "UniversityRow"
})
export default class extends Vue {
    private publicPath: string = process.env.BASE_URL;

    @Prop() private item!: ListItem;

    @Watch("item", { immediate: true })
    private preWashItem() {
        this.item.hasLogo = true;
    }

    private goDetail(id: number) {
        this.$router.push(`/university/detail/${id}`);
    }
}
</script>