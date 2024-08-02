import { Logger, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { DbModule } from './db/db.module'
import { BookModule } from './book/book.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user/entities/user.entity'
import { Role } from './user/entities/role.entity'
import { Permission } from './user/entities/permission.entity'
import { RedisModule } from './redis/redis.module'
import { EmailModule } from './email/email.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { LoginGuard } from './login.guard'
import { APP_GUARD } from '@nestjs/core'
import { PermissionGuard } from './permission.guard'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('postgresql_server_host'),
        port: configService.get('postgresql_server_port'),
        username: configService.get('postgresql_server_username'),
        password: configService.get('postgresql_server_password'),
        database: configService.get('postgresql_server_database'),
        synchronize: false,
        logging: true,
        entities: ['src/**/*.entity.ts'],
        poolSize: 10,
        extra: {
          authPlugin: 'sha256_password',
        },
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt_secret'),
        signOptions: { expiresIn: '30m' }, // 30 minutes
      }),
      inject: [ConfigService],
    }),
    RedisModule,
    UserModule,
    DbModule,
    BookModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    Logger,
  ],
})
export class AppModule {}
