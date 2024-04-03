<script setup lang="ts">
// ...existing code...

import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSingletonWebsocketClient } from '@/support/ws'
import { notification } from 'ant-design-vue'

const user = ref<string>('')
const earthTime = ref('')
const alienTime = ref('')

const toastAlarm = (msg: string) => {
  notification.warn({
    message: 'Time Alarm',
    description: msg,
  })
};

const websocketClient = ref<any>(null)

onMounted(async () => {
  const route = useRoute();
  const router = useRouter();
  await router.isReady();
  user.value = <string>route.query.user
  websocketClient.value = await getSingletonWebsocketClient(user.value)

  websocketClient.value.subscribe(`/user/${user.value}/topic/alarm`, (msg: any) => {
    toastAlarm(msg.body)
  })

  websocketClient.value.subscribe(`/user/${user.value}/topic/time`, (msg: any) => {
    const time = JSON.parse(msg.body)
    earthTime.value = time.earthTime
    alienTime.value = time.alienTime
  })
});

</script>
<template>


  <div class="time-container">
    <div class="time-display">
      <a-descriptions title="时间" layout="vertical">
        <a-descriptions-item label="地球时间">{{ earthTime }}</a-descriptions-item>
        <a-descriptions-item label="外星时间">{{ alienTime }}</a-descriptions-item>
      </a-descriptions>
    </div>
  </div>

</template>

<style scoped>
.time-container {
  /* Add your styles for the time container here */
}

.time-display {
  /* Add your styles for the time display here */
}

.time-selector {
  /* Add your styles for the time selector here */
}

.time-records {
  /* Add your styles for the time records here */
}
</style>
