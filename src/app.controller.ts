import { Controller, Get, Param, Res, Session } from '@nestjs/common';
import { PostService } from './post/post.service';
import { Response } from 'express';

@Controller()
export class AppController {
  private readonly isDevelopment: boolean;

  constructor(private readonly postService: PostService) {
    this.isDevelopment = process.env.NODE_ENV == 'development';
  }

  @Get()
  async home(
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ): Promise<void> {
    const postsByDate = await this.postService.findAllGroupedByDate();
    res.render('home', { postsByDate, admin: this.isAdmin(session) });
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
    const isAdmin = this.isAdmin(session);
    const id = `${year}/${month}/${day}/${slug}`;
    const post = await this.postService.findOne(id, isAdmin);
    res.render('post', { post, admin: isAdmin });
  }

  private isAdmin(session: Record<string, any>): boolean {
    return this.isDevelopment || (session.isAuthenticated as boolean);
  }
}
