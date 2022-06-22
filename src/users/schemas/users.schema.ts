import { Role } from 'src/users/schemas/role.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class User {
    @Prop({ unique: true, required: true, index: true })
    username: string;

    @Prop()
    name: string;

    @Prop()
    family: string;

    @Prop()
    email: string; // TODO: {unique : true}

    @Prop()
    password: string;

    @Prop({ default: false })
    isVerified: boolean;

    @Prop({ default: Role.User })
    role: Role;

    @Prop()
    verifyEmailToken: string;

    @Prop()
    userCode: number;
}

export const UserSchema = SchemaFactory.createForClass(User);