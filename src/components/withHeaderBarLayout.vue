<template>
  <div class="pt-3">
    <header-bar :title="$route.name"></header-bar>
    <v-divider></v-divider>
    <keep-alive :include="['universitySearch']">
        <router-view></router-view>
    </keep-alive>
  </div>
</template>