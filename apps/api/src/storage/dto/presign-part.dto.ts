import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PresignPartDto {
  @ApiProperty({ description: 'File UUID', example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' })
  @IsString()
  @IsNotEmpty()
  fileId!: string;

  @ApiProperty({ description: 'S3 Multipart Upload ID', example: '2~Yz...m6Q' })
  @IsString()
  @IsNotEmpty()
  uploadId!: string;

  @ApiProperty({ description: 'S3 Object Key', example: 'uploads/user_123/file.pdf' })
  @IsString()
  @IsNotEmpty()
  key!: string;

  @ApiProperty({ description: 'Part number (1-indexed)', example: 1 })
  @IsNumber()
  @Min(1)
  partNumber!: number;
}
