import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from 'src/auth/create-user.dto';
import { LoginUserDto } from 'src/auth/login.dto';
import { UpdateDto } from 'src/auth/update-dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}
  async create(createDto: CreateUserDto): Promise<User> {
    createDto.password = await this.authService.createPassword(
      createDto.password,
    );
    delete createDto.confirmPassword;
    // const newUser = { ...createDto, isActive: true } as any;
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    const newUser = await this.authService.register(createDto);
    console.log({ newUser });
    await this.mailService.sendUserConfirmation(newUser, token);
    return newUser;
  }

  async login(loginDto: LoginUserDto) {
    return await this.authService.loginUser(loginDto.email, loginDto.password);
  }

  async update(updateDto: UpdateDto) {
    return await this.authService.update(updateDto);
  }
}
