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
      <slot v-bind:item="item"></slot>
    </v-card>
  </v-list-item>
</template>

<script lang="tsx">
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