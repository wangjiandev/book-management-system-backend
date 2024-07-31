import { Controller, Post, Body, Logger, Query, Get } from '@nestjs/common'
import { UserService } from './user.service'
import { RegisterUserDto } from './dto/register-user.dto'
import { EmailService } from 'src/email/email.service'
import { RedisService } from 'src/redis/redis.service'

@Controller('user')
export class UserController {
  constructor(
    private readonly logger: Logger,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
  ) {}

  @Get('init')
  async init() {
    await this.userService.initData()
    return '初始化成功'
  }

  @Get('captcha')
  async captcha(@Query('address') address: string) {
    this.logger.log(address, UserController.name)
    const code = Math.random().toString().slice(2, 8)
    await this.redisService.set(`captcha_${address}`, code, 5 * 60)
    this.logger.log(code, UserController.name)
    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    })
    return '发送成功'
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    this.logger.log('user/register', UserController.name)
    return await this.userService.register(registerUserDto)
  }
}
