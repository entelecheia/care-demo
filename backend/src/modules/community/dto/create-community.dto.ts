import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCommunityDto {
  @ApiProperty({ example: 'Healthcare Community' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'A community focused on healthcare' })
  @IsString()
  @IsOptional()
  description?: string;
}
