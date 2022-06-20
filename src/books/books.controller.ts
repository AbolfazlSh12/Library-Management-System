import { Controller, Post, Get, Patch, Delete, Body, Param } from "@nestjs/common";
import { CreateBookDto } from "./dto/book-create.dto";
import { BooksService } from "./books.service";
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Books')
@Controller('books')
export class BooksController {
    constructor(private readonly bookService: BooksService) { }

    @Post()
    @ApiOperation({ summary: 'Add Book' })
    async addBook(@Body() createBookDto: CreateBookDto) {
        await this.bookService.create(createBookDto);
        return { message: 'Book added successfully.' };
    }

    @Get()
    @ApiOperation({ summary: 'Get all books' })
    async getBooks() {
        return await this.bookService.findAll();
    }

    @Get('/:bookId')
    @ApiOperation({ summary: 'Get book by bookId' })
    async getBook(@Param('bookId') bookId: string) {
        return await this.bookService.findById(bookId);
    }

    @Delete('/:bookId')
    @ApiOperation({ summary: 'Remove book' })
    async deleteBook(@Param('bookId') bookId: string) {
        await this.bookService.deleteBook(bookId);
        return { message: 'Book deleted successfully.' };;
    }


    @Patch('/:bookId')
    @ApiOperation({ summary: 'Edit book' })
    async updateBook(@Param('bookId') bookId: string, @Body() bookCreateDto: CreateBookDto) {
        await this.bookService.update(bookId, bookCreateDto);
        return { message: 'Book updated successfully.' };
    }
}