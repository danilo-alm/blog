import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { SlugifiedDto } from './dto/slugified.dto';
import { SlugifyRequestDto } from './dto/slugify-request.dto';
import { PostSummaryDto } from './dto/post-summary.dto';
import { PostResponseDto } from './dto/post-response.dto';

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

  @Get(':year/:month/:day/:slug')
  async findOne(
    @Param('year') year: string,
    @Param('month') month: string,
    @Param('day') day: string,
    @Param('slug') slug: string,
  ): Promise<PostResponseDto> {
    const id = `${year}/${month}/${day}/${slug}`;
    return this.postService.findOne(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<PostSummaryDto[]> {
    return this.postService.findAll();
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
