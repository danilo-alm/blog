import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostSummaryDto } from './dto/post-summary.dto';
import { plainToInstance } from 'class-transformer';
import { PostResponseDto } from './dto/post-response.dto';
import { PostsByDateDto } from './dto/posts-by-date.dto';
import { sanitizePostContent } from 'src/common/sanitizer/sanitize-post-content';
import { minify } from 'html-minifier';
import { slugifyTitle } from 'src/common/slugifier/slugify-title';
import { TIME_ZONE } from '../config/config';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostStatus } from './post-status.enum';
import { PostSummaryAdminDto } from './dto/post-summary-admin.dto';

@Injectable()
export class PostService {
  private readonly timeZone: string;

  constructor(private readonly prisma: PrismaService) {
    this.timeZone = TIME_ZONE;
  }

  async create(dto: CreatePostDto): Promise<string> {
    const id = this.generatePostId(dto.title);
    const sanitizedContent = sanitizePostContent(dto.content);
    const minifiedContent = this.minifyContent(sanitizedContent);
    const now = new Date();

    const post = await this.prisma.post.create({
      data: {
        id,
        title: dto.title,
        excerpt: dto.excerpt,
        content: minifiedContent,
        date: now,
        lastModified: now,
        status: PostStatus.Unpublished,
      },
      select: { id: true },
    });
    return post.id;
  }

  async findOne(id: string): Promise<PostResponseDto> {
    const post = await this.prisma.post.findFirstOrThrow({ where: { id } });
    return plainToInstance(PostResponseDto, post);
  }

  async findAll(
    page: number = 1,
    limit?: number,
    admin?: boolean,
  ): Promise<PostSummaryAdminDto[]> {
    const posts = await this.prisma.post.findMany({
      skip: (page - 1) * (limit ?? 0),
      take: limit,
      orderBy: { date: 'desc' },
      omit: { content: true },
      where: { status: admin ? undefined : PostStatus.Published },
    });
    return plainToInstance(PostSummaryAdminDto, posts);
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

  async update(dto: UpdatePostDto): Promise<string> {
    const newStatus =
      dto.status != null
        ? PostStatus[dto.status as keyof typeof PostStatus]
        : undefined;

    const updatedPost = await this.prisma.post.update({
      where: { id: dto.id },
      data: {
        title: dto.title,
        content: dto.content,
        excerpt: dto.excerpt,
        status: newStatus,
        lastModified: new Date(),
      },
      select: { id: true },
    });

    return updatedPost.id;
  }

  private generatePostId(title: string): string {
    const datePath = this.getTodayDatePath();
    const slugifiedTitle = slugifyTitle(title);
    return `${datePath}/${slugifiedTitle}`;
  }

  private minifyContent(content: string): string {
    return minify(content, {
      removeAttributeQuotes: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
    }).trim();
  }

  private getTodayDatePath(): string {
    const today = new Date();
    return today
      .toLocaleDateString('en-CA', { timeZone: this.timeZone })
      .replaceAll('-', '/');
  }

  private groupPostsByMonth(posts: PostSummaryDto[]): PostsByDateDto[] {
    return posts.reduce((acc, post) => {
      const monthYear = this.getMonthYearLabel(post.date);
      let group = acc.find((g) => g.date_label === monthYear);

      if (!group) {
        group = { date_label: monthYear, posts: [] };
        acc.push(group);
      }

      group.posts.push(post);
      return acc;
    }, [] as PostsByDateDto[]);
  }

  private getMonthYearLabel(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      timeZone: this.timeZone,
      month: 'long',
      year: 'numeric',
    });
  }
}
