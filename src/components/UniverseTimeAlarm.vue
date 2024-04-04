<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSingletonWebsocketClient } from '@/support/ws'
import { notification } from 'ant-design-vue'
import dayjs, { Dayjs } from 'dayjs'

const user = ref<string>('')
const selectedTimeZone = ref()
const selectedDate = ref<Dayjs>(null)
const timeRecords = ref<any>([])

const websocketClient = ref<any>(null)

const toastAlarm = (msg: string) => {
  notification.warn({
    message: 'Time Alarm',
    description: msg
  })
}

const addAlarm = () => {
  const timeZone = selectedTimeZone.value
  websocketClient.value
    .rpcCall('/rpc/timeAlarm/add', {
      timeZone,
      year: selectedDate.value.year(),
      month: selectedDate.value.month() + 1,
      day: selectedDate.value.date(),
      hour: selectedDate.value.hour(),
      minute: selectedDate.value.minute(),
      second: selectedDate.value.second()
    })
    .then((res: any) => {
      console.log(`Rpc Received from ${user.value}: ${JSON.stringify(res)}`)
    })
    .catch((e: any) => {
      console.error('Error', e)
    })
}

onMounted(async () => {
  const route = useRoute()
  const router = useRouter()
  await router.isReady()
  user.value = <string>route.query.user
  websocketClient.value = await getSingletonWebsocketClient(user.value)

  websocketClient.value.subscribe(`/user/${user.value}/topic/alarm`, (msg: any) => {
    toastAlarm(msg.body)
  })
})
</script>
<template>
  <div class="time-container">
    <div class="time-selector">
      <a-space>
        <a-select v-model="selectedTimeZone" style="width: 200px" placeholder="选择时区">
          <a-select-option :key="1" :value="'UTC+8'">北京</a-select-option>
          <a-select-option :key="2" value="UTC+0">地球UTC</a-select-option>
          <a-select-option :key="3" value="ALIEN">外星</a-select-option>
        </a-select>

        <a-date-picker
          v-model:value="selectedDate"
          :show-time="{ format: 'HH:mm:ss' }"
          type="date"
          placeholder="选择时间"
        />

        <a-button type="primary" @click="addAlarm">添加</a-button>
      </a-space>
    </div>

    <div class="time-records">
      <div v-for="record in timeRecords" :key="record.id"></div>
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
