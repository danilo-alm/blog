import { Controller, Get, Post, Body, Res, Session } from '@nestjs/common';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

@Controller('admin')
export class AuthController {
  private readonly adminPasswordHash: string;

  constructor() {
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

  @Get('/upload')
  uploadPage(@Res() res: Response): void {
    res.render('upload', { admin: true });
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
      res.render('login', { error: 'Invalid password' });
    }
  }

  @Get('logout')
  logout(@Session() session: Record<string, any>, @Res() res: Response): void {
    session.isAuthenticated = false;
    res.redirect('/');
  }
}
