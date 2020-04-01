<template>
  <v-container class="pa-0">
    <v-row col="12">
        <v-col class="pa-8">
            <v-text-field dense outlined append-icon="search"></v-text-field>
        </v-col>
    </v-row>
    <v-bottom-navigation absolute horizontal color="primary lighten-1">
      <v-btn v-for="menu in menus" :value="menu.name" :to="menu.path" :key="menu.path">
        <span>{{menu.name}}</span>
        <v-icon v-if="menu.icon">{{menu.icon}}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { menus } from "../router";

@Component({
    name: "Home"
})
export default class extends Vue {
    private menus = menus;
}
</script>