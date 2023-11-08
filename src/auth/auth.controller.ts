import { Body, Controller, Post, Put } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './create-user.dto';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import { LoginUserDto } from './login.dto';
import { UpdateDto } from './update-dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}
  @Post('register')
  async register(@Body() userData: CreateUserDto): Promise<User> {
    console.log({ userData: userData });
    return await this.userService.create(userData);
  }

  @Post('login')
  async login(@Body() userData: LoginUserDto): Promise<User> {
    return await this.userService.login(userData);
  }

  @Put()
  async update(@Body() userData: UpdateDto): Promise<User> {
    console.log({ userData });
    return await this.userService.update(userData);
  }
}
