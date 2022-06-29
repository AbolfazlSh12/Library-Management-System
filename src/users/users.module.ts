import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { CartsModule } from './../carts/carts.module';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/users.schema';
import { configService } from '../config.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register(configService.getJwtConfig()),
    CartsModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    LocalStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    JwtStrategy,
  ],
  exports: [UsersService, JwtStrategy, PassportModule],
})
export class UsersModule {}
