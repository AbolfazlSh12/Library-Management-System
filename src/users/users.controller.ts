import { Controller, Post, Get, Patch, Delete, Body, Param } from "@nestjs/common";
import { UserCreateDto } from "./dto/user-create.dto";
import { UserUpdateDto } from "./dto/user-update.dto";
import { UsersService } from "./users.service";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserLoginRo } from "./dto/user-login.ro";
import { VerifyDto } from "./dto/user-verify.dto";

@Controller('users')

export class UsersController {
    constructor(private readonly userservice: UsersService) { }

    @Post()
    async addUser(@Body() userCreateDto: UserCreateDto) {
        await this.userservice.create(userCreateDto);
        await this.userservice.sendVerificationEmail(userCreateDto);
    }

    @Get('verifyEmail')
    async verifyEmail(@Body() verifyDto: VerifyDto) {
        return await this.userservice.verifyEmail(verifyDto);
    }

    @Post('login')
    async login(@Body() userLoginDto: UserLoginDto) {
        this.userservice.verify(userLoginDto)
        return await this.userservice.login(userLoginDto);
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