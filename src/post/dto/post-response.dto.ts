import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TIME_ZONE } from 'src/config/config';

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

  @Transform(
    ({ value }: { value: Date }) => {
      return value.toLocaleDateString('en-US', {
        timeZone: TIME_ZONE,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
    {
      toClassOnly: true,
    },
  )
  @IsString()
  date: string;
}
