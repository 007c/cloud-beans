<template>
    <v-container>
        <header-bar :title="$route.name"></header-bar>
        <v-divider></v-divider>
        <router-view></router-view>
    </v-container>
</template>