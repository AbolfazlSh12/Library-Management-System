import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Role } from 'src/users/schemas/role.enum';

export class UserRo {
    @Expose()
    @ApiProperty()
    public readonly username: string;

    @Expose()
    @ApiProperty()
    public readonly name: string;

    @Expose()
    @ApiProperty()
    public readonly family: string;

    @Expose()
    @ApiProperty()
    public readonly email: string;

    @Expose({ name: 'role' })
    @ApiProperty()
    public readonly role: Role;

    @Expose()
    @ApiProperty()
    public readonly isVerified: boolean;
}
