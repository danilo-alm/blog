import { IsDate, IsOptional, IsString } from 'class-validator';

export class PostSummaryDto {
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  title: string;

  @IsDate()
  date: Date;
}
