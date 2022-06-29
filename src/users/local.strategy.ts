import { UserRo } from 'src/users/dto/user.ro';
import { UserLoginDto } from './dto/user-login.dto';
import { UsersService } from 'src/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const userLoginDto = plainToInstance(UserLoginDto, { username, password });
    const user = await this.usersService.login(userLoginDto);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
