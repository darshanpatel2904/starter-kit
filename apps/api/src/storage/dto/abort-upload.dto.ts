import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AbortUploadDto {
  @ApiProperty({
    description: 'File UUID',
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
  })
  @IsString()
  @IsNotEmpty()
  fileId!: string;

  @ApiPropertyOptional({
    description: 'S3 Multipart Upload ID',
    example: '2~Yz...m6Q',
  })
  @IsString()
  @IsOptional()
  uploadId?: string;

  @ApiProperty({
    description: 'S3 Object Key',
    example: 'uploads/user_123/file.pdf',
  })
  @IsString()
  @IsNotEmpty()
  key!: string;
}
