import { BooksService } from './../books/books.service';
import { BookToCartDto } from './dto/book-to-cart.dto';
import { NotFoundException, HttpException, HttpStatus, Inject } from '@nestjs/common/';
import { Cart, CartDocument } from './schemas/carts.schema';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CartsService {
    constructor(
        @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
        @Inject(BooksService) private booksService: BooksService
    ) { }

    async createCart(username: string): Promise<Cart> {
        const userCart = new this.cartModel({ username });
        await userCart.save();

        return userCart;
    }

    async getCartData(username: string): Promise<Cart> {
        const cart = await this.cartModel.findOne({ username });

        if (!cart) {
            throw new NotFoundException();
        }

        return cart;
    }

    async addBookToCart(bookToCartDto: BookToCartDto): Promise<void> {
        const { username, bookId } = bookToCartDto;

        const book = await this.booksService.findById(bookId)
        if (!book) {
            throw new NotFoundException('The book is not found');
        }
        if (book.isAvailable === false) {
            throw new HttpException(
                `Book ${book.name} is not available`,
                HttpStatus.GONE,
            );
        }
        await this.cartModel.findOneAndUpdate(
            { username },
            { $push: { books: [{ bookId }] } }
        )
        book.isAvailable = false;
        await book.save();
    }

    async removeBookFromCart(bookToCartDto: BookToCartDto): Promise<void> {
        const { username, bookId } = bookToCartDto;
        const book = await this.booksService.findById(bookId)
        if (!book) {
            throw new NotFoundException('The book is not found');
        }
        await this.cartModel.findOneAndUpdate(
            { username },
            { $pull: { books: [{ bookId }] } }
        );
        book.isAvailable = true;
        await book.save();

    }
}
