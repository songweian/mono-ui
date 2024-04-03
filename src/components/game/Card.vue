<script setup lang="ts">
import { defineProps } from 'vue';

// 定义组件接收的属性
const props = defineProps({
  value: String,
  symbol: String,
  image: String
});
</script>

<template>
  <div class="card">
    <img v-if="image" :src="image" alt="Card image" />
    <div class="card-value top-left">
      <span>{{ `${value}${symbol}` }}</span>
    </div>
    <div class="card-value bottom-right">
      <span>{{ `${value}${symbol}` }}</span>
    </div>
  </div>
</template>
<style scoped>
.card {
  width: 50px;
  height: 80px;
  border: 1px solid #000;
  position: relative;
  border-radius: 10px;
  margin: 3px;

}

.card img {
  width: 80%;
  height: 80%;
}

.card-value {
  position: absolute;
  padding: 5px;
  font: bold 16px/1 sans-serif;
}

.card-value.top-left {
  top: 3px;
  left: 3px;
}

.card-value.bottom-right {
  bottom: 3px;
  right: 3px;
}
</style>
