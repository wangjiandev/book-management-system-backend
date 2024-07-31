import { Global, Module } from '@nestjs/common'
import { RedisService } from './redis.service'
import { createClient } from 'redis'
import { ConfigService } from '@nestjs/config'

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        console.log('redis_server_host: ', configService.get('redis_server_host'))
        console.log('redis_server_port: ', configService.get('redis_server_port'))
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
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
