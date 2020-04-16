<template>
  <v-container class="pa-0">
    <v-subheader v-if="isLoaded && followedUniversities.length === 0">暂无数据</v-subheader>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import UniversityRow, { ListItem } from "../components/UniversityRow.vue";
import { withLoading } from "@/decorators/with-loading";
@Component({
    components: {}
})
export default class extends Vue {
    private followedUniversities: ListItem[] = [];
    private isLoaded: boolean = false;

    private created() {
        this.getFollowedUniversities();
    }

    @withLoading()
    private async getFollowedUniversities() {
        await new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
        this.isLoaded = true;
    }
}
</script>