<template>
  <v-container>
    <v-list>
      <university-row v-for="item in followedUniversities" :key="item.schoolID" :item="item"></university-row>
    </v-list>
    <v-subheader v-if="isLoaded && followedUniversities.length < PageSize">没有更多数据了</v-subheader>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import UniversityRow from "../components/UniversityRow.vue";
import { withLoading } from "@/decorators/with-loading";
import { ListItem } from '../components/UniversityRowBase.vue';
@Component({
    components: {
        UniversityRow
    }
})
export default class extends Vue {
    private followedUniversities: ListItem[] = [];
    private isLoaded: boolean = false;

    private PageSize: number = 100;

    private created() {
        this.getFollowedUniversities();
    }

    @withLoading()
    private async getFollowedUniversities() {
        const rsp = await this.$http.get<ResponseModel<ListItem[]>>(
            "/api/Universitys/GetCollectPageList",
            {
                params: {
                    PageIndex: 1,
                    PageSize: 100,
                    Where: ""
                }
            }
        );
        this.followedUniversities = rsp.data.data;
        this.isLoaded = true;
    }
}
</script>