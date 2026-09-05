import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class PresignPartDto {
  @IsString()
  @IsNotEmpty()
  fileId!: string;

  @IsString()
  @IsNotEmpty()
  uploadId!: string;

  @IsString()
  @IsNotEmpty()
  key!: string;

  @IsNumber()
  @Min(1)
  partNumber!: number;
}
