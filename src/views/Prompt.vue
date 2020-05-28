<template>
  <v-container>
    <header-bar title="公告"></header-bar>
    <v-divider></v-divider>
    <v-list>
      <template v-for="(item, index) in prompts">
        <v-list-item class="pa-0" :key="item.pubMsg">
          <v-list-item-avatar>
            <v-icon color="secondary">volume_up</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="index"></v-divider>
      </template>
    </v-list>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Prompt, prompts } from "./prompts";

@Component({
    name: "Prompt"
})
export default class extends Vue {
    private prompts: Prompt[] = [];
    private created() {
        this.getPrompts();
    }
    private async getPrompts() {
        const rsp = await this.$http.get<
            ResponseModel<
                Array<{
                    busiTime: string;
                    createTime: string;
                    id: string;
                    pubMsg: string;
                    pubState: number;
                    pubType: number;
                    showLevels: number;
                }>
            >
        >("/api/Pubs/GetPubsList");

        const data = rsp.data.data;

        this.prompts = data.map(
            (item): Prompt => {
                return {
                    title: item.pubMsg,
                    link: "/prompt"
                };
            }
        );
    }
}
</script>