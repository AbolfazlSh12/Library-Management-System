import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { ConfigModule } from '@nestjs/config';
import { CartsModule } from './carts/carts.module';

@Module({
  imports: [
    UsersModule,
    BooksModule,
    CartsModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost/nest'),
  ],
})

export class AppModule { }
