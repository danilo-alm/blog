import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { SlugifiedDto } from './dto/slugified.dto';
import { SlugifyRequestDto } from './dto/slugify-request.dto';

@Controller('api/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Res() res: Response,
  ): Promise<void> {
    const id = await this.postService.create(createPostDto);
    res.status(HttpStatus.CREATED).location(`/posts/${id}`).send();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.postService.remove(id);
  }

  @Post('slugify')
  @HttpCode(HttpStatus.OK)
  slugify(@Body() slugifyDto: SlugifyRequestDto): SlugifiedDto {
    return this.postService.slugify(slugifyDto.text);
  }
}
