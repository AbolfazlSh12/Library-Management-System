import { ApiProperty } from '@nestjs/swagger';
export class ownerLoginRo {
    @ApiProperty()
    public token: string;
}