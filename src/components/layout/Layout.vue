<script lang="ts" setup>
</script>
<template>
  <a-layout>
    <a-layout-header class="a-layout-header">
      <a-menu mode="horizontal" class="a-menu">
        <a-menu-item key="1" class="a-menu-item">
          <router-link to="/">Home</router-link>
        </a-menu-item>
        <a-menu-item key="2" class="a-menu-item">
          <router-link to="/time">Time</router-link>
        </a-menu-item>
        <a-menu-item key="3" class="a-menu-item">
          <router-link to="/game">Game</router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content class="a-layout-content">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
.a-layout-header {
  background: linear-gradient(to right, peru, blue);
  width: 100%;
  position: fixed;
  z-index: 1;
  left: 0;
}

.a-layout-content {
  margin-top: 64px;
  padding: 20px;
  min-height: calc(100vh - 64px);
}
::v-deep .a-menu {
  height: 100%;
  background-color: transparent;
}

::v-deep .a-menu-item {
  color: #333; /* Change the font color */
  font-size: 1.2em;
  padding: 10px 20px;
}
</style>
