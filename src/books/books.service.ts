import { Injectable, NotFoundException } from '@nestjs/common/';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dto/book-create.dto';

@Injectable()
export class BooksService {
    constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) { }

    async create(createBookDto: CreateBookDto): Promise<Book> {
        const createdBook = new this.bookModel(createBookDto);
        await createdBook.save();

        return createdBook;
    }

    async findAll(): Promise<Book[]> {
        return await this.bookModel.find().exec();
    }

    async findById(bookId: string): Promise<BookDocument> {
        const book = await this.bookModel.findOne({ _id: bookId }).exec();
        if (!book) {
            throw new NotFoundException;
        }
        return book;
    }

    async deleteBook(bookId: string): Promise<void> {
        const book = await this.bookModel.findOne({ _id: bookId }).exec();
        if (!book) {
            throw new NotFoundException()
        }
        await this.bookModel.deleteOne({ _id: bookId });
    }

    async update(bookId: string, bookCreateDto: CreateBookDto): Promise<void> {
        const book = await this.bookModel.findOneAndUpdate(
            { _id: bookId },
            { $set: bookCreateDto },
        );
        if (!book) {
            throw new NotFoundException();
        }
    }
}