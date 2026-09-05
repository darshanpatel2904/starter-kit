import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitiateUploadDto {
  @ApiProperty({
    description: 'Original file name including extension',
    example: 'document.pdf',
  })
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @ApiProperty({ description: 'File size in bytes', example: 1048576 })
  @IsNumber()
  @Min(1)
  fileSize!: number;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'application/pdf',
  })
  @IsString()
  @IsNotEmpty()
  mimeType!: string;
}
