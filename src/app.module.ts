import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { DbModule } from './db/db.module'
import { BookModule } from './book/book.module'
import { WinstonModule } from 'nest-winston'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user/entities/user.entity'
import { Role } from './user/entities/role.entity'
import { Permission } from './user/entities/permission.entity'
import { RedisModule } from './redis/redis.module'
import { EmailModule } from './email/email.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'wangjian',
      password: '',
      database: 'meeting',
      synchronize: true,
      logging: true,
      entities: [User, Role, Permission],
      poolSize: 10,
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
    RedisModule,
    UserModule,
    DbModule,
    BookModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
