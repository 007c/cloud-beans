<template>
  <v-row no-gutters>
    <v-col :cols="cols[0]">
      <v-btn @click="$router.go(-1)" icon color="primary">
        <v-icon>arrow_back</v-icon>
      </v-btn>
    </v-col>
    <v-col class="d-flex align-center justify-center" :cols="cols[1]">
      <h1 class="primary--text subtitle-1 text-center font-weight-bold">{{title}}</h1>
    </v-col>
    <v-col :cols="cols[2]">
      <v-btn v-if="withFollow" @click="onFollow" icon color="primary">
        <v-icon>{{!followed ? 'favorite_border' : 'favorite'}}</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
    name: "HeaderBar"
})
export default class extends Vue {
    @Prop(String) private title!: string;
    @Prop({ default: false, type: Boolean }) private withFollow!: boolean;
    @Prop({ default: false, type: Boolean }) private followed!: boolean;
    @Prop({
        default() {
            return [2, 8, 2];
        },
        type: Array
    })
    private cols!: number[];

    private onFollow() {
        this.$emit("follow");
    }
}
</script>