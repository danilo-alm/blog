import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { PostService } from './post/post.service';
import * as session from 'express-session';
import { AuthMiddleware } from './auth/auth.middleware';
import { randomBytes } from 'crypto';
import { AuthController } from './auth/auth.controller';

@Module({
  providers: [PostService],
  controllers: [AppController, AuthController],
  imports: [PrismaModule, PostModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          secret: process.env.SESSION_SECRET || randomBytes(32).toString('hex'),
          resave: false,
          saveUninitialized: false,
          cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
        }),
      )
      .forRoutes('*');

    consumer.apply(AuthMiddleware).forRoutes('/admin/upload', '/api/*');
  }
}
