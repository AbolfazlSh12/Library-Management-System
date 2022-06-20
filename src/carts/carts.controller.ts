import { BookToCartDto } from './dto/book-to-cart.dto';
import { CartsService } from 'src/carts/carts.service';
import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Carts')
@Controller('carts')
export class CartsController {
    constructor(private readonly cartsService: CartsService) { }

    @Get()
    @ApiOperation({ summary: 'Get cart data' })
    async getCart(@Body('username') username: string) {
        return await this.cartsService.getCartData(username);
    }

    @Post()
    @ApiOperation({ summary: 'Add book to cart' })
    async AddBookToCart(@Body() bookToCartDto: BookToCartDto) {
        return await this.cartsService.addBookToCart(bookToCartDto);
    }

    @Delete()
    @ApiOperation({ summary: 'Remove book from cart' })
    async DeleteBookFromCart(@Body() bookToCartDto: BookToCartDto) {
        return await this.cartsService.removeBookFromCart(bookToCartDto);
    }
}
