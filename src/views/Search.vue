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
          :search-input.sync="searchWord"
          @click:prepend-inner="onSearch"
        ></v-autocomplete>
      </v-col>
    </v-row>
    <v-divider class="mt-2"></v-divider>

    <v-row>
      <v-col>
        <v-btn
          @click="onSearchSwitch(0)"
          tile
          class="mr-4"
          color="primary"
          :outlined="searchBy===1"
        >搜院校</v-btn>
        <v-btn @click="onSearchSwitch(1)" tile color="primary" :outlined="searchBy===0">搜专业</v-btn>
      </v-col>
    </v-row>

    <v-subheader class="pa-0">热门搜索</v-subheader>
    <v-row>
      <v-col class="pa-4 pt-0">
        <v-btn
          color="secondary"
          small
          class="mr-2 mt-2"
          depressed
          outlined
          v-for="item in hotSearch"
          :key="item.id"
          :to="detailPath + item.id"
        >{{item.name}}</v-btn>
      </v-col>
    </v-row>
    <v-subheader class="pa-0">历史搜索</v-subheader>
    <v-row>
      <v-col class="pa-4 pt-0">
        <v-btn
          color="secondary"
          small
          class="mr-2 mt-2"
          depressed
          outlined
          v-for="item in historySearch"
          :key="item.id"
          :to="detailPath + item.id"
        >{{item.name}}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { createDebounce } from "../util";
import { MajorInfo } from "../components/MajorRow.vue";
import { ListItem } from "../components/UniversityRowBase.vue";
import { withLoading } from "../decorators/with-loading";
import { mapGetters } from "vuex";
import { RawLocation } from "vue-router";

interface SearchItem {
    id: number;
    name: string;
}

@Component({
    name: "Search",
    computed: {
        ...mapGetters(["isLogin"])
    }
})
export default class extends Vue {
    private isLogin!: boolean;
    private searchWord: string = "";

    private historySearch: SearchItem[] = [];

    private hotSearch: SearchItem[] = [];
    // 0 院校 1 专业
    private searchBy: 0 | 1 = 0;

    get detailPath(): string {
        if (this.searchBy === 0) {
            return "/university/detail/";
        }

        return "/major/detail/";
    }
    get autocompleteItems() {
        return this.hotSearch.map((item) => {
            return {
                text: item.name,
                value: item.name
            };
        });
    }
    private onSearchSwitch(searchBy: 0 | 1) {
        this.searchBy = searchBy;
        this.getSearchInfo();
    }

    private created() {
        this.getSearchInfo();
    }

    private getSearchInfo() {
        if (this.searchBy === 0) {
            this.getUniversityHotSearch();
            this.getUniversityHistorySearch();
        } else {
            this.getMajorHotSearch();
            this.getMajorHistorySearch();
        }
    }

    private async onSearch() {
        const rawLocation: RawLocation = {
            path: this.searchBy === 0 ? "/university/query" : "/major/query",
            query: {
                query: this.searchWord
            }
        };

        this.$router.push(rawLocation);
    }

    private mapMajorsToSearchs(data: MajorInfo[]) {
        return data.map((item) => {
            return {
                id: item.majorID,
                name: item.majorName
            };
        });
    }

    private mapUvtsToSearchs(data: ListItem[]) {
        return data.map((item) => {
            return {
                id: item.schoolID,
                name: item.fullName
            };
        });
    }

    @withLoading()
    private async getMajorHotSearch() {
        const rsp = await this.$http.get<ResponseModel<MajorInfo[]>>(
            "/api/MajorInfos/GetHotMajorPage",
            {
                params: {
                    PageIndex: 0,
                    PageSize: 10,
                    Where: ""
                }
            }
        );

        const data = rsp.data.data;

        this.hotSearch = this.mapMajorsToSearchs(data);
    }

    @withLoading()
    private async getMajorHistorySearch() {
        if (!this.isLogin) {
            return;
        }

        const rsp = await this.$http.get<ResponseModel<MajorInfo[]>>(
            "/api/MajorInfos/GetMajorHistoryPageList",
            {
                params: { PageIndex: 0, PageSize: 10, Where: "" }
            }
        );

        this.historySearch = this.mapMajorsToSearchs(rsp.data.data);
    }

    @withLoading()
    private async getUniversityHotSearch() {
        const rsp = await this.$http.get<ResponseModel<ListItem[]>>(
            "/api/Universitys/GetHotUniversityPage",
            {
                params: {
                    PageIndex: 0,
                    PageSize: 10,
                    Where: ""
                }
            }
        );

        const data = rsp.data.data;

        this.hotSearch = this.mapUvtsToSearchs(data);
    }

    @withLoading()
    private async getUniversityHistorySearch() {
        if (!this.isLogin) {
            return;
        }

        const rsp = await this.$http.get<ResponseModel<ListItem[]>>(
            "/api/Universitys/GetUniversityHistoryPageList",
            {
                params: { PageIndex: 0, PageSize: 10, Where: "" }
            }
        );

        this.historySearch = this.mapUvtsToSearchs(rsp.data.data);
    }
}
</script>