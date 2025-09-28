import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePolicyDto {
  @ApiProperty({ example: 'Healthcare Policy' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'A comprehensive healthcare policy' })
  @IsString()
  @IsOptional()
  description?: string;
}
