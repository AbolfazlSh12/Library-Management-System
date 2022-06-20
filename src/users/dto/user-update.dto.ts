import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UserUpdateDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    public readonly name?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    public readonly family?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    @Transform(({ value }) => value.toLowerCase())
    public readonly email?: string;
}