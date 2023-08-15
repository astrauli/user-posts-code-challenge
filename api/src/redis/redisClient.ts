import { RedisClientOptions, createClient } from 'redis'

const clientOptions: RedisClientOptions = {
  url: process.env.REDIS_URL,
}

export const createRedisClient = () => {
  return new Promise((resolve, reject) => {
    const redisClient = createClient(clientOptions)

    redisClient.connect()

    redisClient.on('error', (err) => {
      console.log('Could not establish a connection with redis. ' + err)
      reject(err)
    })

    redisClient.on('connect', () => {
      console.log('Connected to redis successfully')
      resolve(redisClient)
    })
  })
}
