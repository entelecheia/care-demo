import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { PolicyService } from './policy.service';
import { CreatePolicyDto } from './dto/create-policy.dto';

@ApiTags('policy')
@Controller('policy')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new policy' })
  @ApiResponse({ status: 201, description: 'Policy created successfully' })
  async create(@Body() createPolicyDto: CreatePolicyDto) {
    return this.policyService.create(createPolicyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all policies' })
  @ApiResponse({ status: 200, description: 'Policies retrieved successfully' })
  async findAll() {
    return this.policyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get policy by ID' })
  @ApiResponse({ status: 200, description: 'Policy retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.policyService.findOne(id);
  }
}
