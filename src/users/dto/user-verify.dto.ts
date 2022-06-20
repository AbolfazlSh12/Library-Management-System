import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class VerifyDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'Bad username' })
    public readonly username: string;

    @ApiProperty()
    public readonly code: string;
}