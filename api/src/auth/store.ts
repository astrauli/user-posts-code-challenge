import RedisStore from 'connect-redis'
import { RedisClientType } from 'redis'

export const redisStore = (client: RedisClientType) => {
  return new RedisStore({ client })
}
