import { ResetPasswordDto } from './dto/reset-password.dto';
import { Controller, Post, Get, Patch, Delete, Body, Param } from "@nestjs/common";
import { UserCreateDto } from "./dto/user-create.dto";
import { UserUpdateDto } from "./dto/user-update.dto";
import { UsersService } from "./users.service";
import { UserLoginDto } from "./dto/user-login.dto";

@Controller('users')

export class UsersController {
    constructor(private readonly userservice: UsersService) { }

    @Post()
    async addUser(@Body() userCreateDto: UserCreateDto) {
        await this.userservice.create(userCreateDto);
    }

    @Get('verifyEmail/:username/:token')
    async verifyEmail(
        @Param('username') username: string,
        @Param('token') code: string
    ) {
        return await this.userservice.verifyEmail({ username, code });
    }

    @Post('resetPasswordRequest')
    async mailResetPassword(@Body('email') email: string) {
        return await this.userservice.sendMailResetPassword(email);
    }

    @Post('resetPassword')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return await this.userservice.resetPassword(resetPasswordDto);
    }

    @Post('login')
    async login(@Body() userLoginDto: UserLoginDto) {
        this.userservice.verify(userLoginDto)
        return await this.userservice.login(userLoginDto);
    }

    @Post('loginOwner')
    async loginOwner(@Body() userLoginDto: UserLoginDto) {
        return await this.userservice.loginOwner(userLoginDto);
    }

    @Get()
    async getUsers() {
        return await this.userservice.findAll();
    }

    @Get('/:username')
    async getUser(@Param('username') username: string) {
        return await this.userservice.findByUsername(username);
    }

    @Delete('/:username')
    async deleteUser(@Param('username') username: string) {
        await this.userservice.deleteUser(username);
        return { message: 'User deleted successfully.' };
    }


    @Patch('/:username')
    async updateUser(@Param('username') username: string, @Body() userUpdateDto: UserUpdateDto) {
        await this.userservice.update(username, userUpdateDto);
        return { message: 'User updated successfully.' };
    }
}