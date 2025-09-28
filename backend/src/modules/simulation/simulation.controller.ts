import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { SimulationService } from './simulation.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';

@ApiTags('simulation')
@Controller('simulation')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new simulation' })
  @ApiResponse({ status: 201, description: 'Simulation created successfully' })
  async create(@Body() createSimulationDto: CreateSimulationDto) {
    return this.simulationService.create(createSimulationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all simulations' })
  @ApiResponse({
    status: 200,
    description: 'Simulations retrieved successfully',
  })
  async findAll() {
    return this.simulationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get simulation by ID' })
  @ApiResponse({
    status: 200,
    description: 'Simulation retrieved successfully',
  })
  async findOne(@Param('id') id: string) {
    return this.simulationService.findOne(id);
  }
}
