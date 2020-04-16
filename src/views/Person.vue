<template>
  <v-container>
    <header-bar title="个人中心"></header-bar>
    <v-divider></v-divider>
    <v-row>
      <v-col cols="3" class="pr-0">
        <v-avatar class="mt-n1" size="65" color="grey">
          <v-icon color="white">person</v-icon>
        </v-avatar>
      </v-col>
      <v-col>
        <v-row>
          <v-col class="py-0">180****0039</v-col>
        </v-row>
        <v-row class="body-2">
          <v-col
            cols="10"
          >{{studentInfo.province || '--'}} | {{ mapSubject(studentInfo.subject) || '--'}} | {{studentInfo.grade|| '--'}} 分| {{studentInfo.rank || '--'}}名</v-col>
          <v-col class="px-0">
            <v-btn to="/grade/edit" x-small icon>
              <v-icon>edit</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-divider></v-divider>

    <v-list>
      <template v-for="(menu, index) in menuList">
        <v-list-item :key="menu.path" class="pl-0">
          <v-list-item-avatar>
            <v-icon>{{menu.icon}}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="d-flex justify-space-between">
              {{menu.name}}
              <router-link :to="menu.path">>></router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="index"></v-divider>
      </template>
    </v-list>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Menu, personMenu } from "../router";
import { StudentInfo, Subject } from "../store/use-state";

@Component({
    name: "Person"
})
export default class extends Vue {
    private menuList: Menu[] = personMenu;
    get studentInfo(): StudentInfo {
        return this.$store.state.userState.studentInfo;
    }
    private mapSubject(subject: number) {
        return Subject[subject];
    }
}
</script>