import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CompletedPartDto {
  @ApiProperty({ description: 'ETag header returned by S3 chunk upload', example: 'e2c569ba1739d108932560a4e320f78d' })
  @IsString()
  @IsNotEmpty()
  ETag!: string;

  @ApiProperty({ description: 'Part number (1-indexed)', example: 1 })
  @IsNumber()
  @Min(1)
  PartNumber!: number;
}

export class CompleteUploadDto {
  @ApiProperty({ description: 'File UUID', example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' })
  @IsString()
  @IsNotEmpty()
  fileId!: string;

  @ApiPropertyOptional({ description: 'S3 Multipart Upload ID (required for multipart uploads)', example: '2~Yz...m6Q' })
  @IsString()
  @IsOptional()
  uploadId?: string;

  @ApiProperty({ description: 'S3 Object Key', example: 'uploads/user_123/file.pdf' })
  @IsString()
  @IsNotEmpty()
  key!: string;

  @ApiPropertyOptional({ description: 'List of uploaded parts with ETags for multipart completion', type: [CompletedPartDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CompletedPartDto)
  parts?: CompletedPartDto[];
}
