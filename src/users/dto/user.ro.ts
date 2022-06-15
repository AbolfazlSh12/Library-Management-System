import { Role } from 'src/users/schemas/users.schema';

export class UserRo {
    public readonly username: string;
    public readonly name: string;
    public readonly family: string;
    public readonly email: string;
    public readonly password: string;
    public readonly isVerified: boolean;
    public readonly role: Role;
}
