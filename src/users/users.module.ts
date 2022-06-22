import { RolesGuard } from './roles.guard';
import { CartsModule } from './../carts/carts.module';
import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/users.schema';
import { configService } from '../config.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register(configService.getJwtConfig()),
        CartsModule
    ],
    controllers: [UsersController],
    providers: [UsersService,
        {
            provide: APP_GUARD,
            useClass: RolesGuard
        }
    ],
    exports: [UsersService]
})

export class UsersModule { }