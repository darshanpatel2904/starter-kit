import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AbortUploadDto {
  @IsString()
  @IsNotEmpty()
  fileId!: string;

  @IsString()
  @IsOptional()
  uploadId?: string;

  @IsString()
  @IsNotEmpty()
  key!: string;
}
