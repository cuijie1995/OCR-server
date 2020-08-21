<template>
  <div id="app">
    <router-view />

    <!-- <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>-->
  </div>
</template>

<style lang="scss">
body,
html,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background: #404040;
}
// *{
//   box-sizing: border-box;
// }
</style>
