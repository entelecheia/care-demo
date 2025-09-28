import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateSimulationDto {
  @ApiProperty({ example: 'Healthcare Simulation' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'A comprehensive healthcare simulation' })
  @IsString()
  @IsOptional()
  description?: string;
}
