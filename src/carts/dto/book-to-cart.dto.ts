import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class BookToCartDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'Bad username' })
    public readonly username: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    public readonly bookId: string;
}