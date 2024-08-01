import { Controller, Post, Body, Logger, Query, Get, UnauthorizedException } from '@nestjs/common'
import { UserService } from './user.service'
import { RegisterUserDto } from './dto/register-user.dto'
import { EmailService } from 'src/email/email.service'
import { RedisService } from 'src/redis/redis.service'
import { LoginUserDto } from './dto/login-user.dto'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Controller('user')
export class UserController {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
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

  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const userVo = await this.userService.login(loginUser, false)
    userVo.accessToken = this.jwtService.sign(
      {
        userId: userVo.userInfo.id,
        username: userVo.userInfo.username,
        roles: userVo.userInfo.roles,
        permissions: userVo.userInfo.permissions,
      },
      {
        expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    )

    userVo.refreshToken = this.jwtService.sign(
      {
        userId: userVo.userInfo.id,
      },
      {
        expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d',
      },
    )
    return userVo
  }

  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const userVo = await this.userService.login(loginUser, true)
    userVo.accessToken = this.jwtService.sign(
      {
        userId: userVo.userInfo.id,
        username: userVo.userInfo.username,
        roles: userVo.userInfo.roles,
        permissions: userVo.userInfo.permissions,
      },
      {
        expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    )

    userVo.refreshToken = this.jwtService.sign(
      {
        userId: userVo.userInfo.id,
      },
      {
        expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d',
      },
    )
    return userVo
  }

  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken)
      const user = await this.userService.findUserById(data.userId, false)
      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          roles: user.roles,
          permissions: user.permissions,
        },
        {
          expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m',
        },
      )
      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d',
        },
      )
      return {
        access_token,
        refresh_token,
      }
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录')
    }
  }

  @Get('admin/refresh')
  async adminRefresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken)

      const user = await this.userService.findUserById(data.userId, true)

      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          roles: user.roles,
          permissions: user.permissions,
        },
        {
          expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m',
        },
      )

      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d',
        },
      )

      return {
        access_token,
        refresh_token,
      }
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录')
    }
  }
}
