import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface AuthSession {
  isAuthenticated?: boolean;
  redirectUrl?: string;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(
    req: Request & { session: AuthSession },
    res: Response,
    next: NextFunction,
  ): void {
    if (req.session?.isAuthenticated) {
      next();
    } else {
      req.session.redirectUrl = req.originalUrl;
      res.redirect('/admin/login');
    }
  }
}
