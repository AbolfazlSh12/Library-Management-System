import { UserLoginRo } from './dto/user-login.ro';
import { AuthGuard } from '@nestjs/passport';
import { UserRo } from 'src/users/dto/user.ro';
import { Role } from 'src/users/schemas/role.enum';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { UsersService } from './users.service';
import { UserLoginDto } from './dto/user-login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions } from './roles.decorator';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userservice: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Signup' })
  async addUser(@Body() userCreateDto: UserCreateDto): Promise<UserRo> {
    return await this.userservice.create(userCreateDto);
  }

  @Get('verifyEmail/:username/:token')
  @ApiOperation({ summary: 'Verify email' })
  async verifyEmail(
    @Param('username') username: string,
    @Param('token') code: string,
  ) {
    return await this.userservice.verifyEmail({ username, code });
  }

  @Post('resetPasswordRequest')
  @ApiOperation({ summary: 'Request for reset password' })
  async mailResetPassword(@Body('email') email: string) {
    return await this.userservice.sendMailResetPassword(email);
  }

  @Post('resetPassword')
  @ApiOperation({ summary: 'Reset password' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.userservice.resetPassword(resetPasswordDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login' })
  async login(@Body() userLoginDto: UserLoginDto): Promise<UserLoginRo> {
    return await this.userservice.login(userLoginDto);
  }

  @Post('loginOwner')
  @ApiOperation({ summary: 'Owner login' })
  async loginOwner(@Body() userLoginDto: UserLoginDto) {
    return await this.userservice.loginOwner(userLoginDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get users' })
  async getUsers() {
    return await this.userservice.findAll();
  }

  @Get('/:username')
  @ApiOperation({ summary: 'Get user by username' })
  async getUser(@Param('username') username: string) {
    return await this.userservice.findByUsername(username);
  }

  @Delete('/:username')
  @Permissions(Role.Admin)
  @ApiOperation({ summary: 'Remove user' })
  async deleteUser(@Param('username') username: string) {
    await this.userservice.deleteUser(username);
    return { message: 'User deleted successfully.' };
  }

  @Patch('/:username')
  @Permissions(Role.Admin)
  @ApiOperation({ summary: 'Edit user' })
  async updateUser(
    @Param('username') username: string,
    @Body() userUpdateDto: UserUpdateDto,
  ) {
    await this.userservice.update(username, userUpdateDto);
    return { message: 'User updated successfully.' };
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test() {
    console.log('Hi there');
  }
}
