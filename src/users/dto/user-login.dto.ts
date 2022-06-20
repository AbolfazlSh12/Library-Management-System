import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class UserLoginDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'Bad username' })
    public readonly username: string;

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
