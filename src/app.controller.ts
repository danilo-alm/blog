import { Controller, Get, Param, Res, Session } from '@nestjs/common';
import { PostService } from './post/post.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async home(@Res() res: Response): Promise<void> {
    const postsByDate = await this.postService.findAllGroupedByDate();
    res.render('home', { postsByDate });
  }

  @Get('posts/:year/:month/:day/:slug')
  async post(
    @Param('year') year: string,
    @Param('month') month: string,
    @Param('day') day: string,
    @Param('slug') slug: string,
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ): Promise<void> {
    const id = `${year}/${month}/${day}/${slug}`;
    const post = await this.postService.findOne(id);
    const isAdmin = session.isAuthenticated as boolean;
    res.render('post', { post, admin: isAdmin });
  }
}
