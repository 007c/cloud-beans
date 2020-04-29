<template>
  <university-row-base :item="item">
    <template v-slot:default="scope">
      <v-list-item-content>
        <v-list-item-title class="d-flex justify-space-between align-center row no-gutters">
          <span class="col-8 text-truncate">{{scope.item.fullName}}</span>
          <span class="col-4">
            <advisory-btn @click.native.stop :typeCode="1"></advisory-btn>
          </span>
          <!-- <span class="body-2">{{item.provinceName}}</span> -->
        </v-list-item-title>
        <v-list-item-content class="pa-0">
          <v-row no-gutters class="caption">
            <v-col  class="text-truncate" cols="2" sm="3">{{scope.item.provinceName}}</v-col>
            <v-col class cols="10" sm="4">
              <v-btn
                outlined
                color="primary"
                class="mx-1 mb-1"
                depressed
                tile
                x-small
                v-for="text in normalizeLabels(scope.item.labels)"
                :key="text"
              >{{text}}</v-btn>
            </v-col>
            <v-col class cols="12" sm="5">热度： {{scope.item.popularity}}</v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item-content>
    </template>
  </university-row-base>
</template>

<script lang="ts">
import UniversityRowBase, { ListItem } from "./UniversityRowBase.vue";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
@Component({
    name: "UniversityRow",
    components: {
        UniversityRowBase
    }
})
export default class extends Vue {
    @Prop() private item!: ListItem;
    private normalizeLabels(labels: string): string[] {
        return labels.split(",").slice(0, 3);
    }
}
</script>