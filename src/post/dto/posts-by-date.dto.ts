import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { PostSummaryDto } from './post-summary.dto';
import { Type } from 'class-transformer';

export class PostsByDateDto {
  @IsString()
  @IsNotEmpty()
  date_label: string; // json naming

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostSummaryDto)
  posts: PostSummaryDto[];
}
