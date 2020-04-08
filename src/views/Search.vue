<style lang="less">
.v-text-field.v-input--dense .v-input__prepend-inner .v-input__icon > .v-icon,
.v-text-field.v-input--dense .v-input__append-inner .v-input__icon > .v-icon {
    margin-top: 0;
}
</style>
<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="2">
        <v-btn @click="$router.go(-1)" icon color="primary">
          <v-icon>arrow_back</v-icon>
        </v-btn>
      </v-col>
      <v-col>
        <v-autocomplete
          prepend-inner-icon="search"
          hide-no-data
          :items="autocompleteItems"
          hide-details
          outlined
          dense
          autofocus
          v-model="searchWord"
          @update:search-input="onSerchInputUpdate"
        ></v-autocomplete>
      </v-col>
    </v-row>
    <v-divider class="mt-2"></v-divider>
    <v-subheader class="pa-0">热门搜索</v-subheader>
    <v-row>
      <v-col class="pa-4 pt-0">
        <v-btn
          color="secondary"
          x-small
          class="mr-2"
          depressed
          outlined
          v-for="item in hotSearch"
          :key="item"
        >{{item}}</v-btn>
      </v-col>
    </v-row>
    <v-subheader class="pa-0">历史搜索</v-subheader>
    <v-row>
      <v-col class="pa-4 pt-0">
        <v-btn
          color="secondary"
          x-small
          class="mr-2"
          depressed
          outlined
          v-for="item in historySearch"
          :key="item"
        >{{item}}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { createDebounce } from "../util";

@Component({
    name: "Search"
})
export default class extends Vue {
    private searchWord: string = "";
    private autocompleteItems: string[] = [
        "西南名大",
        "西南财经",
        "电子科技大学"
    ];

    private hotSearch = [
        "西南名大",
        "西南财经",
        "电子科技大学",
        "四川大学",
        "成都理工大学",
        "西南名族大学"
    ];

    private searchHander!: () => void;

    private historySearch = ["成都理工大学"];

    private searchUniversity() {
        // console.log("search");
    }

    private onSerchInputUpdate() {
        if (!this.searchHander) {
            const searchHander = createDebounce(
                () => {
                    this.searchUniversity();
                },
                1000,
                2000
            );

            this.searchHander = searchHander;
        }
        this.searchHander();
    }
}
</script>