import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [UserService, AuthService, JwtService],
})
export class UserModule {}
