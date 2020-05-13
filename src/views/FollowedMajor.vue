<template>
  <v-container>
    <v-list>
      <major-row v-for="item in majorList" :key="item.majorID" :item="item"></major-row>
    </v-list>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import MajorRow, { MajorInfo } from "../components/MajorRow.vue";

@Component({
    components: {
        MajorRow
    }
})
export default class extends Vue {
    private majorList: MajorInfo[] = [];

    private created() {
        this.getFollowedMajors();
    }

    private async getFollowedMajors() {
        const rsp = await this.$http.get<ResponseModel<MajorInfo[]>>(
            "/api/MajorInfos/GetCollectPageList",
            {
                params: {
                    PageIndex: 1,
                    PageSize: 1000,
                    Where: ""
                }
            }
        );

        this.majorList = rsp.data.data;
    }
}
</script>