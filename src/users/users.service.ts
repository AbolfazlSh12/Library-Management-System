import { UserLoginRo } from './dto/user-login.ro';
import { JwtPayload } from './jwt-payload';
import { UnauthorizedException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserRo } from 'src/users/dto/user.ro';
import { CartsService } from './../carts/carts.service';
import { Role } from 'src/users/schemas/role.enum';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common/';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { configService } from 'src/config.service';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyDto } from './dto/user-verify.dto';
import * as crypto from 'crypto';
import { ownerLoginRo } from './dto/owner-login.ro';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly mailService: nodemailer.Transporter;
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private cartsService: CartsService,
  ) {
    this.mailService = nodemailer.createTransport(
      configService.getMailConfig(),
    );
  }

  create = async (userCreateDto: UserCreateDto): Promise<UserRo> => {
    // Check for not duplicate username.
    const { username, password } = userCreateDto;
    const checkUser = await this.userModel.findOne({ username });
    if (checkUser) {
      throw new ConflictException(`username '${username}' already exists`);
    }

    // Create a new user and save it to the database.
    const salt = await bcrypt.genSalt();
    const user = new this.userModel({
      ...userCreateDto,
      password: await this.hashPassword(password, salt),
      salt,
    });
    await user.save();

    const userRo = plainToInstance(UserRo, user, {
      excludeExtraneousValues: true,
    });

    // Return User to the frontend
    return userRo;
  };

  async sendVerificationEmail(createdUser: UserCreateDto): Promise<void> {
    const { username, email } = createdUser;
    const code = await this.jwtService.signAsync({ username });

    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException();
    }

    user.verifyEmailToken = code;
    await user.save();

    const mail = {
      from: configService.getMailAuth().user,
      to: email,
      subject: 'Library Email Verification !',
      text: `
            Hi ${username}\n
            This is your email verification link:
            \nhttp://localhost:3000/users/verifyEmail/${username}/${code}`,
    };

    try {
      this.mailService.sendMail(mail);
    } catch (err) {
      console.log(err);
    }
  }

  async verifyEmail(verifyDto: VerifyDto): Promise<void> {
    const username = verifyDto.username;
    const code = verifyDto.code;

    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException(`User ${username} not found`);
    }

    if (user.username !== username || user.verifyEmailToken !== code) {
      throw new HttpException(
        `unsuccessful verification ${username}.`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    user.isVerified = true;
    user.verifyEmailToken = '';
    await user.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userModel.findOne({ username }).exec();
  }

  async deleteUser(username: string): Promise<void> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException();
    }
    await this.userModel.deleteOne({ username });
  }

  async update(username: string, userUpdateDto: UserUpdateDto): Promise<void> {
    const user = await this.userModel.findOneAndUpdate(
      { username },
      { $set: userUpdateDto },
    );
    if (!user) {
      throw new NotFoundException();
    }
  }

  async login(userLoginDto: UserLoginDto): Promise<UserLoginRo> {
    /* UserLoginRo */
    // const { username, password } = userLoginDto;
    const username = await this.validateUserPassword(userLoginDto);

    if (!username) {
      throw new UnauthorizedException('Invalid Credentials!');
    }

    const user = await this.findByUsername(username);
    const payload: JwtPayload = { username };
    const token = await this.jwtService.signAsync(payload);
    return { user, token };
  }

  async loginOwner(userLoginDto: UserLoginDto): Promise<ownerLoginRo> {
    const username = userLoginDto.username;
    const password = userLoginDto.password;

    if (
      username !== configService.getOwnerAuth().username ||
      password !== configService.getOwnerAuth().password
    ) {
      throw new NotFoundException();
    }

    return {
      token: await this.jwtService.signAsync({
        username,
        userRole: Role.Owner,
      }),
    };
  }

  async verify(userLoginDto: UserLoginDto): Promise<void> {
    const username = userLoginDto.username;
    const password = userLoginDto.password;
    const user = await this.userModel.findOne({ username, password });
    if (!user) {
      throw new NotFoundException();
    }
  }

  async sendMailResetPassword(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException();
    }

    const resetCode = crypto.randomInt(100000, 999999);

    const mail = {
      from: configService.getMailAuth().user,
      to: email,
      subject: 'Library Reset Password !',
      text: `Hi ${user.username}\n
            This is your reset password code: ${resetCode}`,
    };

    try {
      this.mailService.sendMail(mail);
      user.userCode = resetCode;
      user.save();
    } catch (err) {
      console.log(err);
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { email, code, password } = resetPasswordDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException();
    }

    if (user.userCode !== code) {
      throw new HttpException(`The code is not match.`, HttpStatus.BAD_REQUEST);
    }

    user.password = password;
    user.userCode = null;
    await user.save();
  }

  private hashPassword = async (
    password: string,
    salt: string,
  ): Promise<string> => {
    return bcrypt.hash(password, salt);
  };

  async validateUserPassword(userLoginDto: UserLoginDto): Promise<string> {
    const { username, password } = userLoginDto;
    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials!');
    }

    const hash = await bcrypt.hash(password, user.salt);
    if (hash === user.password) {
      return user.username;
    }
    return null;
  }
}
