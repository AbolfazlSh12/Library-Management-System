import { configService } from 'src/config.service';
import { User } from './schemas/users.schema';
import { JwtPayload } from './jwt-payload';
import { UserRo } from 'src/users/dto/user.ro';
import { UsersService } from 'src/users/users.service';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getJwtConfig().secret,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user = await this.usersService.findByUsername(username);

    console.log(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
