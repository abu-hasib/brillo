import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import prisma from 'src/lib/prisma';
import { CreateUserDto } from './create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UpdateDto } from './update-dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async register(data: CreateUserDto): Promise<User> {
    try {
      const user = await prisma.user.create({
        data: {
          ...data,
        },
      });
      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          console.log(
            'There is a unique constraint violation, a new user cannot be created with this email',
          );
        }
      }
      // throw e;
      return e.message;
    }
  }

  async createPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await prisma.user.findFirst({ where: { email } });
    const isPasswordVerified = await this.verifyPassword(
      password,
      user.password,
    );
    if (isPasswordVerified) {
      return user;
    }
    return null;
  }

  async loginUser(email: string, password: string): Promise<any> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new Error('Not found');
    }
    const authUser = { email: user.email, phone: user.phone, id: user.id };
    return { success: true, user: authUser };
  }

  async update(updateDto: UpdateDto): Promise<User> {
    if (updateDto.password)
      updateDto.password = await this.createPassword(updateDto.password);
    const { email, ...others } = updateDto;
    return await prisma.user.update({
      where: {
        email,
      },
      data: {
        ...others,
      },
    });
  }
}
