import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';


export type CartDocument = Cart & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Cart {
    @Prop({ unique: true, ref: 'UserSchema' })
    username: string;

    @Prop()
    books: [
        {
            bookId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "BookSchema"
            },
            quantity: {
                type: Number,
                default: 1,
            }
        }
    ]
}

export const CartSchema = SchemaFactory.createForClass(Cart);