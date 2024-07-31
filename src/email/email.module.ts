import { Global, Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { EmailController } from './email.controller'

@Global()
@Module({
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
