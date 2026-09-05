import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CompletedPartDto {
  @IsString()
  @IsNotEmpty()
  ETag!: string;

  @IsNumber()
  @Min(1)
  PartNumber!: number;
}

export class CompleteUploadDto {
  @IsString()
  @IsNotEmpty()
  fileId!: string;

  @IsString()
  @IsOptional()
  uploadId?: string;

  @IsString()
  @IsNotEmpty()
  key!: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CompletedPartDto)
  parts?: CompletedPartDto[];
}
