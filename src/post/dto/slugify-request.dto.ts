import { IsNotEmpty, IsString } from 'class-validator';

export class SlugifyRequestDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
