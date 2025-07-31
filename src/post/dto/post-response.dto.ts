import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { formatDate } from '../utils/format-date';

export class PostResponseDto {
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  title: string;

  @Transform(({ value }: { value: Date }) => formatDate(value))
  @IsString()
  date: string;
}
