import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
export class Book {
    @Prop()
    name: string;

    @Prop()
    author: string;

    @Prop()
    category: string;

    @Prop()
    price: number;

    @Prop()
    isbn: string;

    @Prop({ default: true })
    isAvailable: boolean;

}

export const BookSchema = SchemaFactory.createForClass(Book);