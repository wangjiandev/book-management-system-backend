import { Controller, Get, Logger } from '@nestjs/common'
import { RequireLogin, RequirePermission, UserInfo } from './custom.decorator'
import { JwtUserData } from './login.guard'

@Controller()
export class AppController {
  constructor(private readonly logger: Logger) {}

  @Get('aaa')
  @RequireLogin()
  @RequirePermission('ddd')
  aaaa(@UserInfo('username') username: string, @UserInfo() userInfo: JwtUserData) {
    this.logger.log(username, AppController.name)
    this.logger.log(JSON.stringify(userInfo), AppController.name)
    return 'aaa'
  }

  @Get('bbb')
  bbb() {
    return 'bbb'
  }
}
