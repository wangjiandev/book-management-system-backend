import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Logger,
} from '@nestjs/common'
import { BookService } from './book.service'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import * as path from 'path'
import { storage } from './my-file-storage'

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  private logger = new Logger()

  /**
   * 上传文件
   * dest 是保存文件的目录
   * limits 是文件大小限制,限制为 3 M
   * fileFilter 限制扩展名只能是图片
   * @param file
   * @returns
   */
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads',
      storage: storage,
      limits: {
        fileSize: 1024 * 1024 * 3,
      },
      fileFilter(req, file, callback) {
        const extname = path.extname(file.originalname)
        if (['.png', '.jpg', '.gif'].includes(extname)) {
          callback(null, true)
        } else {
          callback(new BadRequestException('只能上传图片'), false)
        }
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file)
    return file.path
  }

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto)
  }

  @Get()
  async findAll() {
    this.logger.debug('获取所有书籍', BookController.name)
    this.logger.error('获取所有书籍', BookController.name)
    this.logger.fatal('获取所有书籍', BookController.name)
    this.logger.log('获取所有书籍', BookController.name)
    this.logger.verbose('获取所有书籍', BookController.name)
    this.logger.warn('获取所有书籍', BookController.name)
    return this.bookService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookService.findOne(+id)
  }

  @Patch()
  update(@Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(updateBookDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(+id)
  }
}
