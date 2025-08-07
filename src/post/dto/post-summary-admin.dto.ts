import { Transform } from 'class-transformer';
import { PostSummaryDto } from './post-summary.dto';
import { IsString } from 'class-validator';
import { dateToLocaleString } from '../date-to-locale-string';
import { PostStatus } from '../post-status.enum';

export class PostSummaryAdminDto extends PostSummaryDto {
  @Transform(({ value }: { value: Date }) => dateToLocaleString(value), {
    toClassOnly: true,
  })
  @IsString()
  lastModified: string;

  @Transform(({ value }: { value: number }) => PostStatus[value], {
    toClassOnly: true,
  })
  @IsString()
  status: string;
}
