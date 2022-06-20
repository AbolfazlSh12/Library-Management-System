import { BooksModule } from './../books/books.module';
import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/carts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    BooksModule
  ],
  providers: [CartsService],
  controllers: [CartsController],
  exports: [CartsService]

})

export class CartsModule { }
