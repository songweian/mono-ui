<script setup lang="ts">
import Card from '@/components/game/Card.vue'

import { computed, type CSSProperties, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSingletonWebsocketClient } from '@/support/ws'
import * as cardGameApi from '../api/CardGameApi'
import { notification } from 'ant-design-vue'

defineProps<{ msg: string }>()

const user = ref<string>('')
const gameInfo = ref<cardGameApi.GameInfo>({} as cardGameApi.GameInfo)
const websocketClient = ref<any>(null)

const toastAlarm = (msg: string) => {
  notification.config({
    placement: 'bottomRight',
    bottom: '50px',
    duration: 3,
    rtl: true
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
  // gameInfo.value = await cardGameApi.test()
})

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
  console.log('gameInfo', gameInfo.value)
  return gameInfo.value.cards
})

const players = computed(() => {
  if (!gameInfo.value.players) {
    return []
  }
  console.log('gameInfo', gameInfo.value)
  return gameInfo.value.players
})

const winnerName = computed(() => {
  if (!gameInfo.value.winnerName) {
    return null
  }
  console.log('gameInfo', gameInfo.value)
  return gameInfo.value.winnerName
})

const playerCardContainerStyle: CSSProperties = {
  border: '1px solid ' + winnerName.value ? 'green' : 'black'
}
</script>
<template>
  <div>
    <!-- card game -->
    <div class="my-2">
      <span>对局ID {{ gameInfo.id || '' }}</span>
    </div>
    <div class="my-2">
      <a-space>
        <a-button type="primary" @click="initGame">进入游戏</a-button>
        <a-button type="primary" @click="shuffleGameCards">洗牌</a-button>
        <a-button type="primary" @click="startGame">发牌</a-button>
        <a-button type="primary" @click="getWinner">查看结果</a-button>
      </a-space>
    </div>
    <div class="card-container" v-if="cards && cards.length > 0">
      <Card v-for="card in cards" :value="card.value" :symbol="card.symbol" />
    </div>
    <div
      :class="['card-container', { winner: winnerName === player.name }]"
      v-for="player in players"
    >
      <div>
        <div v-if="winnerName == player.name">
          <span>🏆获胜🏆</span>
        </div>
        <div style="display: flex; flex-direction: column">
          <div>游戏玩家</div>
          <div style="height: 100%; display: flex; align-items: center; justify-content: center">
            {{ player.name }}
          </div>
        </div>
      </div>
      <Card v-for="card in player.cards" :value="card.value" :symbol="card.symbol" />
    </div>
  </div>
</template>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: left; /* Optional: Add some space between the cards */
  border: 2px solid gray;
  border-radius: 15px;
  padding: 2px;
  margin: 5px;
  background-color: peru;
}

.winner {
  border: 2px solid yellow;
  background: linear-gradient(to right, orange, yellow, green, blue, indigo, violet);
}
</style>
