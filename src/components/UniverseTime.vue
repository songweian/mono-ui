<script setup lang="ts">
// ...existing code...

import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSingletonWebsocketClient } from '@/support/ws'
import { notification } from 'ant-design-vue'

const user = ref<string>('')
const selectedTimeZone = ref('')
const selectedDate = ref<any>(null)
const selectedTime = ref<any>(null)
const timeRecords = ref<any>([])

const earthTime = ref('')
const alienTime = ref('')
const addTimeRecord = () => {
  // Add your logic to add a time record here
}


const toastAlarm = (msg: string) => {
  notification.warn({
    message: 'Time Alarm',
    description: msg,
  })
};

const websocketClient = ref<any>(null)

const addAlarm = () => {
  const time = `${selectedDate.value} ${selectedTime.value}`
  console.log(`addAlarm`, selectedDate)
  console.log(`addAlarm`, selectedTime)
  const timeZone = selectedTimeZone.value
  websocketClient.value.rpcCall("/rpc/timeAlarm/add", {
    timeZone,
    year: selectedDate.value,
    month: selectedDate.value.getMonth() + 1,
    day: selectedDate.value.getDate(),
    hour: selectedTime.value.getHours(),
    minute: selectedTime.value.getMinutes(),
    second: selectedTime.value.getSeconds(),
  })
    .then((res: any) => {
      console.log(`Rpc Received from ${user.value}: ${JSON.stringify(res)}`)
    })
    .catch((e: any) => {
      console.error("Error", e)
    })
}

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

// ...existing code...
</script>
<template>

  <!-- ...existing code... -->

  <div class="time-container">
    <div class="time-display">
      <a-descriptions title="时间" layout="vertical">
        <a-descriptions-item label="地球时间">{{ earthTime }}</a-descriptions-item>
        <a-descriptions-item label="外星时间">{{ alienTime }}</a-descriptions-item>
      </a-descriptions>
    </div>

    <div class="time-selector">
      <a-space>
        <a-select v-model="selectedTimeZone" style="width: 200px" placeholder="选择时区">
          <a-select-option value="UTC+0">地球UTC</a-select-option>
          <a-select-option value="UTC+1">北京</a-select-option>
          <a-select-option value="UTC+2">外星</a-select-option>
        </a-select>

        <a-date-picker v-model="selectedDate" type="date" placeholder="选择日期"></a-date-picker>
        <a-time-picker v-model="selectedTime" placeholder="选择时间"></a-time-picker>
        <a-button type="primary" @click="addTimeRecord">添加</a-button>
      </a-space>
    </div>

    <div class="time-records">
      <div v-for="record in timeRecords" :key="record.id">
        <!-- Display your time record here -->
      </div>
    </div>
  </div>

  <!-- ...existing code... -->
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
