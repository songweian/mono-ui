import { Client } from '@stomp/stompjs'

let websocketClient: any
const createWebsocketClient = (stompClientUser: string) => {
  const stompClient = new Client({
    brokerURL: `ws://localhost:8080/ws?user=${stompClientUser}`,
    connectHeaders: {
      login: `${stompClientUser}`,
      passcode: 'my-passcode'
    },
    onConnect: () => {
      console.log('WebSocket rpc connected.')
      stompClient.subscribe(`/user/${stompClientUser}/topic/rpc`, (message: any) => {
        console.log(`Received RPC Message Body: `, message.body)
        const payload = JSON.parse(message.body)
        const headers = (message.headers = message.headers || {})
        const rpcId = headers['rpcId'] || ''
        const resolve = rpcRequestMapping[rpcId]

        if (resolve) {
          resolve(payload)
        }
      })
    }
  })

  const connect = () => {
    return new Promise((resolve, reject) => {
      if (!stompClient.connected) {
        console.log('STOMP client is not connected, attempting to reconnect...')
        stompClient.activate()

        // 等待1秒以确保新建的连接已经可用
        setTimeout(() => {
          if (stompClient.connected) {
            console.log('STOMP client is connected')
            resolve(true)
          } else {
            reject(new Error('STOMP client failed to connect'))
          }
        }, 100)
      } else {
        resolve(true)
      }
    })
  }

  const sendUserCommand = (wsCommand: string, commandBody: any) => {
    stompClient.publish({ destination: `/app/${wsCommand}`, body: commandBody })
  }

  const subscribe = async (destination: string, callback: any) => {
    console.log('Subscribing to: ', destination)
    await connect()
    stompClient.subscribe(destination, callback)
  }

  const rpcRequestMapping: any = {}

  const rpcCall = (command: string, rpcBody: any, timeout: number = 1000) => {
    console.log('RPC Call: ', command, rpcBody, timeout)
    const correlationId = new Date().getTime().toString()
    const promise = new Promise((resolve) => {
      rpcRequestMapping[correlationId] = resolve
    })

    stompClient.publish({
      destination: '/app' + command,
      headers: {
        rpcId: correlationId,
        rpcCommand: command
      },
      body: JSON.stringify(rpcBody)
    })

    const timeoutPromise = new Promise((_, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id)
        reject(new Error('RPC call timed out'))
      }, timeout)
    })

    return Promise.race([promise, timeoutPromise])
  }

  return {
    user: stompClientUser,
    stompClient,
    sendUserCommand,
    connect,
    subscribe,
    rpcCall
  }
}

export const getSingletonWebsocketClient = async (stompClientUser: string) => {
  if (!websocketClient) {
    websocketClient = createWebsocketClient(stompClientUser)
    console.log('Creating new websocket client for user: ', stompClientUser)
  }
  if (!websocketClient.stompClient.connected) {
    console.log('Connecting to STOMP server...')
    await websocketClient.connect()
  }
  return websocketClient
}
