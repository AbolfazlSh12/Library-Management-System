import { BookToCartDto } from './dto/book-to-cart.dto';
import { CartsService } from 'src/carts/carts.service';
import { Body, Controller, Delete, Get, Post } from '@nestjs/common';

@Controller('carts')
export class CartsController {
    constructor(private readonly cartsService: CartsService) { }

    @Get()
    async getCart(@Body('username') username: string) {
        return await this.cartsService.getCartData(username);
    }

    @Post()
    async AddBookToCart(@Body() bookToCartDto: BookToCartDto) {
        return await this.cartsService.addBookToCart(bookToCartDto);
    }

    @Delete()
    async DeleteBookFromCart(@Body() bookToCartDto: BookToCartDto) {
        return await this.cartsService.removeBookFromCart(bookToCartDto);
    }
}
