<template>
  <v-container>
    <v-row>
      <v-col class="align-center d-flex justify-center" cols="3">
        <h2 class="justify-center d-flex align-center subtitle-1 grey--text">院校查询</h2>
      </v-col>
      <v-col class="pl-3 pr-6">
        <v-text-field
          height="15px"
          hide-details
          dense
          outlined
          append-icon="search"
          placeholder="请输入院校名称"
          v-model="universityName"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row>
        <v-col>
            <v-select height="30px" dense label="院校地区(省)" outlined></v-select>
        </v-col>
        <v-col>
            <v-select dense label="院校地区(市)" outlined></v-select>
        </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
@Component({
    name: "universitySearch"
})
export default class extends Vue {
    private universityName: string = ""
}
</script>