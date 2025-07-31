import { Module } from '@nestjs/common';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { PostService } from './post/post.service';

@Module({
  providers: [PostService],
  controllers: [AppController],
  imports: [PrismaModule, PostModule],
})
export class AppModule {}
