import { Role } from 'src/users/schemas/role.enum';
import { SetMetadata } from '@nestjs/common';

export const Permissions = (...roles: Role[]) => SetMetadata('roles', roles);