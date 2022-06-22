import { CartsService } from './../carts/carts.service';
import { Role } from 'src/users/schemas/role.enum';
import { UserLoginRo } from './dto/user-login.ro';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common/';
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
        )
    }

    async create(userCreateDto: UserCreateDto): Promise<User> {
        const { username } = userCreateDto;
        const user = await this.userModel.findOne({ username });
        // ToDo: check if username and email not duplicate.
        if (username === configService.getOwnerAuth().username || user) {
            throw new HttpException(
                `username ${username} already exists.`,
                HttpStatus.CONFLICT,
            );
        }

        const createdUser = new this.userModel(userCreateDto);
        await createdUser.save();

        this.sendVerificationEmail(createdUser);

        this.cartsService.createCart(username)
        return createdUser;
    }

    async sendVerificationEmail(createdUser: UserCreateDto): Promise<void> {
        const { username, email } = createdUser;
        const code = await this.jwtService.signAsync({ username });

        const user = await this.userModel.findOne({ username });
        if (!user) {
            throw new NotFoundException()
        }

        user.verifyEmailToken = code;
        await user.save();


        const mail = {
            from: configService.getMailAuth().user,
            to: email,
            subject: "Library Email Verification !",
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
            throw new NotFoundException()
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
        const username = userLoginDto.username;
        const password = userLoginDto.password;

        const user = await this.userModel.findOne({ username, password });
        const userRole = user.role;

        return {
            token: await this.jwtService.signAsync({ username, userRole }),
            user
        }
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
            token: await this.jwtService.signAsync({ username, userRole: Role.Owner }),
        }
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
            subject: "Library Reset Password !",
            text: `Hi ${user.username}\n
            This is your reset password code: ${resetCode}`
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
            throw new HttpException(
                `The code is not match.`,
                HttpStatus.BAD_REQUEST
            );
        }

        user.password = password;
        user.userCode = null;
        await user.save();
    }
}