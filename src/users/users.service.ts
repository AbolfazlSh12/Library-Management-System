import { UserLoginRo } from './dto/user-login.ro';
import { UserRo } from 'src/users/dto/user.ro';
import { Injectable, NotFoundException } from '@nestjs/common/';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { configService } from 'src/config.service';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyDto } from './dto/user-verify.dto';

@Injectable()
export class UsersService {
    private readonly mailService: nodemailer.Transporter;
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly jwtService: JwtService
    ) { }

    async create(userCreateDto: UserCreateDto): Promise<User> {
        const createdUser = new this.userModel(userCreateDto);
        await createdUser.save();

        // this.sendVerificationEmail(userCreateDto);

        return createdUser;
    }

    async sendVerificationEmail(userCreateDto: UserCreateDto): Promise<void> {
        const { username, email } = userCreateDto;
        const code = await this.jwtService.signAsync({ username })
        const user = await this.userModel.findOne({ email: email });
        if (!user) {
            return;
        }

        const mail = {
            from: configService.getMailAuth().user,
            to: email,
            subject: "Library Email Verification !",
            text: `http://localhost:3000/users/verifyEmail?username=${username}&token=${code}`,
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
        return {
            token: await this.jwtService.signAsync({ username }),
            user
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
}