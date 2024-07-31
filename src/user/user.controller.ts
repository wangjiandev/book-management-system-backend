import { Controller, Post, Body, Logger } from '@nestjs/common'
import { UserService } from './user.service'
import { RegisterUserDto } from './dto/register-user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly logger: Logger) {}

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    this.logger.log('user/register', UserController.name)
    return this.userService.register(registerUserDto)
  }
}
