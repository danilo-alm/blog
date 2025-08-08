import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Session,
  UnauthorizedException,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { PostService } from 'src/post/post.service';

@Controller('admin')
export class AuthController {
  private readonly adminPasswordHash: string;

  constructor(private readonly postService: PostService) {
    if (!process.env.ADMIN_PASSWORD_HASH) {
      throw new Error('ADMIN_PASSWORD_HASH environment variable is required');
    }
    this.adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  }

  @Get('login')
  loginPage(
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ): void {
    if (session.isAuthenticated) {
      res.redirect('/admin/upload');
    } else {
      res.render('login');
    }
  }

  @Get('upload')
  createPost(@Res() res: Response): void {
    res.render('post_editor', { admin: true });
  }

  @Get('edit/:year/:month/:day/:slug')
  async editPost(
    @Res() res: Response,
    @Session() session: Record<string, any>,
    @Param('year') year: string,
    @Param('month') month: string,
    @Param('day') day: string,
    @Param('slug') slug: string,
  ): Promise<void> {
    const id = `${year}/${month}/${day}/${slug}`;
    const post = await this.postService.findOne(
      id,
      session.isAuthenticated as boolean,
    );
    res.render('post_editor', {
      admin: true,
      edit: true,
      ...post,
      urlSlug: id,
    });
  }

  @Get('dashboard')
  async dashboardPage(@Res() res: Response): Promise<void> {
    const posts = await this.postService.findAll(undefined, undefined, true);

    res.render('dashboard', { admin: true, posts });
  }

  @Post('login')
  login(
    @Body('password') password: string,
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ): void {
    if (bcrypt.compareSync(password, this.adminPasswordHash)) {
      session.isAuthenticated = true;

      let redirectUrl = session.redirectUrl as string;

      // NestJS makes req.originalUrl '/admin/null' after losing session
      // and being redirected to login after trying to create a post. Idk why :(
      if (!redirectUrl || redirectUrl.endsWith('null')) {
        redirectUrl = '/admin/upload';
      }

      delete session.redirectUrl;
      res.redirect(redirectUrl);
    } else {
      throw new UnauthorizedException('Invalid password');
    }
  }

  @Get('logout')
  logout(@Session() session: Record<string, any>, @Res() res: Response): void {
    session.isAuthenticated = false;
    res.redirect('/');
  }
}
