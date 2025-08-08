import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PostStatus } from '../post-status.enum';

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  excerpt?: string;

  @IsOptional()
  @IsNotEmpty()
  @Transform(
    ({ value }: { value: string }) =>
      PostStatus[value as keyof typeof PostStatus],
    {
      toPlainOnly: true,
    },
  )
  status?: number;
}
