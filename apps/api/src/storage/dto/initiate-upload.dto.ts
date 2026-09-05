import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class InitiateUploadDto {
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @IsNumber()
  @Min(1)
  fileSize!: number;

  @IsString()
  @IsNotEmpty()
  mimeType!: string;
}
