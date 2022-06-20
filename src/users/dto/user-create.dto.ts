import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UserCreateDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'Bad username' })
    public readonly username: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    public readonly name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    public readonly family: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    @Transform(({ value }) => value.toLowerCase())
    public readonly email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/^((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z])[^\s]{8,20}$/, {
        message:
            'Password is too weak. It should contain both lower case and upper case characters and non-word or numeric characters.',
    })
    @ApiProperty()
    public readonly password: string;
}