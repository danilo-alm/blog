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
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { PostResponseDto } from './dto/post-response.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostSummaryAdminDto } from './dto/post-summary-admin.dto';

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
  async findAll(): Promise<PostSummaryAdminDto[]> {
    return this.postService.findAll();
  }

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Body() updatePostDto: UpdatePostDto,
    @Res() res: Response,
  ): Promise<void> {
    const id = await this.postService.update(updatePostDto);
    res.status(HttpStatus.NO_CONTENT).location(`/posts/${id}`).send();
  }

  @Delete(':year/:month/:day/:slug')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('year') year: string,
    @Param('month') month: string,
    @Param('day') day: string,
    @Param('slug') slug: string,
  ): Promise<void> {
    const id = `${year}/${month}/${day}/${slug}`;
    await this.postService.remove(id);
  }
}
