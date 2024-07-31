import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { WinstonModule } from 'nest-winston'
import { transports, format } from 'winston'
import * as chalk from 'chalk'
import * as dayjs from 'dayjs'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ context, level, message }) => {
              const appStr = chalk.green(`[TaiShan]`)
              const contextStr = chalk.yellow(`[${context}]`)
              const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')
              return `${appStr} ${time} ${level} ${contextStr} ${message} `
            }),
          ),
        }),
        new transports.File({
          format: format.combine(format.timestamp(), format.json()),
          filename: 'taishan.log',
          dirname: 'log',
        }),
      ],
    }),
  })
  // 全局启用 ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  // 支持下跨域访问
  app.enableCors()
  // 静态资源访问,便于访问上传的文件
  app.useStaticAssets(join(__dirname, '../uploads'), { prefix: '/uploads' })
  await app.listen(3000)
}
bootstrap()
