import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import slugify from 'slugify';
import { PostSummaryDto } from './dto/post-summary.dto';
import { plainToInstance } from 'class-transformer';
import { PostResponseDto } from './dto/post-response.dto';
import { PostsByDateDto } from './dto/posts-by-date.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePostDto): Promise<string> {
    const id = this.generatePostId(dto.title);
    const post = await this.prisma.post.create({
      data: {
        id,
        ...dto,
        date: new Date(),
      },
      select: { id: true },
    });
    return post.id;
  }

  async findOne(id: string): Promise<PostResponseDto> {
    const post = await this.prisma.post.findFirstOrThrow({ where: { id } });
    return plainToInstance(PostResponseDto, post);
  }

  async findAllGroupedByDate(
    page: number = 1,
    limit?: number,
  ): Promise<PostsByDateDto[]> {
    const posts = await this.findAll(page, limit);
    return this.groupPostsByMonth(posts);
  }

  async remove(id: string): Promise<void> {
    await this.prisma.post.delete({ where: { id } });
  }

  private generatePostId(title: string): string {
    const datePath = this.getTodayDatePath();
    const slugifiedTitle = this.slugifyTitle(title);
    return `${datePath}/${slugifiedTitle}`;
  }

  private getTodayDatePath(): string {
    const today = new Date();
    return today.toISOString().split('T')[0].replaceAll('-', '/');
  }

  private slugifyTitle(title: string): string {
    return slugify(title, { lower: true, strict: true });
  }

  private groupPostsByMonth(posts: PostSummaryDto[]): PostsByDateDto[] {
    return posts.reduce((acc, post) => {
      const monthYear = this.getMonthYearLabel(post.date);
      let group = acc.find((g) => g.dateLabel === monthYear);

      if (!group) {
        group = { dateLabel: monthYear, posts: [] };
        acc.push(group);
      }

      group.posts.push(post);
      return acc;
    }, [] as PostsByDateDto[]);
  }

  private getMonthYearLabel(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }

  private async findAll(
    page: number = 1,
    limit?: number,
  ): Promise<PostSummaryDto[]> {
    const posts = await this.prisma.post.findMany({
      skip: (page - 1) * (limit ?? 0),
      take: limit,
      orderBy: { date: 'desc' },
      omit: { content: true },
    });
    return plainToInstance(PostSummaryDto, posts);
  }
}
