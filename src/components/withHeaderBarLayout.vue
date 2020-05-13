<template>
  <div class="pt-3">
    <header-bar :title="$route.name"></header-bar>
    <v-divider></v-divider>
    <router-view></router-view>
  </div>
</template>