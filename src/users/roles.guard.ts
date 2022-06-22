import { Role } from 'src/users/schemas/role.enum';
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // what is the require role ?
        const permissions = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ])

        if (!permissions) {
            return true;
        }

        // const { user } = context.switchToHttp().getRequest();
        const user = {
            username: 'Amir',
            roles: [Role.User]
        }

        return permissions.some((role) => user.roles.includes(role));
    }

}