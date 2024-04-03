<script setup lang="ts">
import Card from '@/components/game/Card.vue'

import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSingletonWebsocketClient } from '@/support/ws'
import * as cardGameApi from '../api/CardGameApi'
import { test } from '@/api/CardGameApi'
import { notification } from 'ant-design-vue'
import UniverseTime from '@/components/UniverseTime.vue'

defineProps<{ msg: string }>()

const input = ref('')
const user = ref<string>(null)

const alienTime = ref<string>(null)
const earthTime = ref<string>(null)

const curDate = ref<any>()
const curTime = ref<any>()

const toast = () => {
  notification.config({
    placement: 'bottomRight',
    bottom: '50px',
    duration: 3,
    rtl: true
  })
}
const toastAlarm = (msg: string) => {
  notification.config({
    placement: 'bottomRight',
    bottom: '50px',
    duration: 3,
    rtl: true
  })
}

const websocketClient = ref<any>(null)

const addAlarm = () => {
  const time = `${curDate.value} ${curTime.value}`
  console.log(`addAlarm`, curDate)
  console.log(`addAlarm`, curTime)
  const timeZone = input.value
  websocketClient.value.rpcCall('/rpc/timeAlarm/add', {
    timeZone,
    year: curDate.value.getFullYear(),
    month: curDate.value.getMonth() + 1,
    day: curDate.value.getDate(),
    hour: curTime.value.getHours(),
    minute: curTime.value.getMinutes(),
    second: curTime.value.getSeconds()
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

  websocketClient.value.subscribe(`/user/${user.value}/topic/time`, (msg: any) => {
    const time = JSON.parse(msg.body)
    earthTime.value = time.earthTime
    alienTime.value = time.alienTime
  })

  gameInfo.value = await cardGameApi.test()
})

const gameInfo = ref<cardGameApi.GameInfo>({} as cardGameApi.GameInfo)
const initGame = async () => {
  gameInfo.value = await cardGameApi.initGame()
}

const shuffleGameCards = async () => {
  console.log(`shuffleGameCards`, gameInfo.value)
  gameInfo.value = await cardGameApi.shuffleCards(gameInfo.value.id)
}

const startGame = async () => {
  gameInfo.value = await cardGameApi.startGame(gameInfo.value.id)
}

const getWinner = async () => {
  console.log(`getWinner`, gameInfo.value.id)
  gameInfo.value = await cardGameApi.getWinner(gameInfo.value.id)
}

const cards = computed(() => {
  if (!gameInfo.value.cards) {
    return []
  }
  return gameInfo.value.cards
})

const players = computed(() => {
  if (!gameInfo.value.players) {
    return []
  }
  return gameInfo.value.players
})

const winnerName = computed(() => {
  if (!gameInfo.value.winnerName) {
    return null
  }
  return gameInfo.value.winnerName
})
</script>
<template>
  <UniverseTime />
  <!-- card game -->
  <div class="my-2">
    <span>game {{ gameInfo.id || '' }}</span>
  </div>
  <div class="my-2">
    <a-space>
      <a-button type="primary" @click="initGame">进入游戏</a-button>
      <a-button type="primary" @click="shuffleGameCards">洗牌</a-button>
      <a-button type="primary" @click="startGame">发牌</a-button>
      <a-button type="primary" @click="getWinner">查看结果</a-button>
    </a-space>
  </div>
  <div class="card-container" v-for="player in players">
    <div>
      {{ player.name }}
    </div>
    <Card v-for="card in player.cards" :value="card.value" :symbol="card.symbol" />
  </div>  <div class="card-container" v-for="player in players">
    <div>
      {{ player.name }}
    </div>
    <Card v-for="card in player.cards" :value="card.value" :symbol="card.symbol" />
  </div>  <div class="card-container" v-for="player in players">
    <div>
      {{ player.name }}
    </div>
    <Card v-for="card in player.cards" :value="card.value" :symbol="card.symbol" />
  </div>  <div class="card-container" v-for="player in players">
    <div>
      {{ player.name }}
    </div>
    <Card v-for="card in player.cards" :value="card.value" :symbol="card.symbol" />
  </div>  <div class="card-container" v-for="player in players">
    <div>
      {{ player.name }}
    </div>
    <Card v-for="card in player.cards" :value="card.value" :symbol="card.symbol" />
  </div>
</template>

<style scoped>
.card-container {
  display: flex;
  flex-direction: row;
  justify-content: left; /* Optional: Add some space between the cards */
}
</style>
