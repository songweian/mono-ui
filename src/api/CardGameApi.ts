/**
 * 获取初始化的排
 * 发牌
 * 获取当前棋手的排
 * 判断胜负
 */
import { notification } from 'ant-design-vue'

const toast = (message: string) => {
  notification.config({
    placement: 'topRight',
    bottom: '50px',
    duration: 3,
    rtl: true
  })
}

const postData = async (url = '', data = {}) => {
  console.log('postData', url, data)
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  const res = await response.json()
  console.log(res)
  if (!response.ok) {
    toast('fetch api http error ' + (res.message || ''))
    throw new Error(res.message)
  }
  if (!'200' == res.code) {
    toast('fetch api error ' + (res.message || ''))
    throw new Error(res.message)
  }
  console.log('url', url, 'data', res.data)
  return res.data
}

export const test = async (): Promise<GameInfo> => {
  return postData('/api/card-game/test')
}

export const initGame = async (): Promise<GameInfo> => {
  return postData('/api/card-game/init')
}

export const shuffleCards = async (id: string): Promise<GameInfo> => {
  return postData(`/api/card-game/shuffle-cards/${id}`)
}

export const startGame = async (id: string): Promise<GameInfo> => {
  return postData(`/api/card-game/start-game/${id}`)
}

export const getWinner = async (id: string): Promise<GameInfo> => {
  return postData(`/api/card-game/get-winner/${id}`)
}

export interface Card {
  value: string
  symbol: string
  color: string
  image: string
}

interface Player {
  name: string
  cards: Card[]
}

export interface GameInfo {
  id: string
  cards: Card[]
  players: Player[]
  winnerName: string
}
