<template>
  <v-list-item class="pa-0 mb-2" @click="goDetail(item.schoolID)">
    <v-card width="100%" class="d-flex pl-2 pr-2">
      <div class="d-flex justify-center flex-column">
        <v-list-item-avatar class="my-2" color="secondary" size="60">
          <v-img v-if="hasLogo" :alt="item.fullName.substring(0,1)" :src="logoUrl"></v-img>
          <span v-else class="white--text">{{item.fullName.substring(0,1)}}</span>
        </v-list-item-avatar>
        <span
          v-if="showname"
          style="max-width: 12em"
          class="caption text-truncate text-center"
        >{{item.fullName}}</span>
      </div>
      <slot v-bind:item="item"></slot>
    </v-card>
  </v-list-item>
</template>

<script lang="tsx">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { loadUniversityLogo } from "../util/static-loader";
import { AxiosResponse } from "axios";
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

    private logoUrl: string = "";

    private hasLogo: boolean = false;

    @Prop() private item!: ListItem;

    @Prop({ default: false }) private showname!: boolean;

    private created() {
        this.getLogoImg();
    }

    private goDetail(id: number) {
        this.$router.push(`/university/detail/${id}`);
    }

    private async getLogoImg() {
        try {
            const rsp: AxiosResponse<Blob> = await loadUniversityLogo(
                this.item.fullName
            );
            this.logoUrl = URL.createObjectURL(rsp.data);
            this.hasLogo = true;
        } catch (ex) {
            this.hasLogo = false;
        }
    }

    private beforeDestroy() {
        URL.revokeObjectURL(this.logoUrl);
    }
}
</script>