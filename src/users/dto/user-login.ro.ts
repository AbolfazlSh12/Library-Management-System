import { UserRo } from 'src/users/dto/user.ro';

export class UserLoginRo {
    public token: string;
    public user: UserRo;
}