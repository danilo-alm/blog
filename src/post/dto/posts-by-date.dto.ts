import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { PostSummaryDto } from './post-summary.dto';
import { Type } from 'class-transformer';

export class PostsByDateDto {
  @IsString()
  @IsNotEmpty()
  dateLabel: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostSummaryDto)
  posts: PostSummaryDto[];
}
