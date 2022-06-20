import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    @Transform(({ value }) => value.toLowerCase())
    public readonly email: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    public readonly code: number;

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