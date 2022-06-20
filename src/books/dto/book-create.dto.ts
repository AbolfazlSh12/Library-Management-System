import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateBookDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    public readonly name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    public readonly author: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    public readonly category: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    public readonly price: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    public readonly isbn: string;
}