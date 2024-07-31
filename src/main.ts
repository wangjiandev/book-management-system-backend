import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  /**
   *  全局启用 ValidationPipe
   *  transform: true 转换成 DTO 对象
   */
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
