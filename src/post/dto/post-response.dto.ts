import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { dateToLocaleString } from '../date-to-locale-string';

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

  @Transform(({ value }: { value: Date }) => dateToLocaleString(value), {
    toClassOnly: true,
  })
  @IsString()
  date: string;
}
