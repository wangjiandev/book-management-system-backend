import { Global, Module } from '@nestjs/common'
import { RedisService } from './redis.service'
import { createClient } from 'redis'

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: '192.168.1.131',
            port: 6379,
          },
          database: 1,
          password: 'Dezhi@2024..',
        })
        await client.connect()
        return client
      },
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
