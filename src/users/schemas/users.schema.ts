import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum Role {
    User = 'User',
    Admin = 'Admin',
    Owner = 'Owner',
}

@Schema()
export class User {
    @Prop()
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

    @Prop()
    verifyEmailToken: string;

    @Prop({ default: Role.User })
    role: Role;

}

export const UserSchema = SchemaFactory.createForClass(User);