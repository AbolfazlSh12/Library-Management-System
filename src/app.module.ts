import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    BooksModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost/nest')
  ],
  controllers: [],
  providers: [],
})

export class AppModule { }
