import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { CommunityService } from './community.service';
import { CreateCommunityDto } from './dto/create-community.dto';

@ApiTags('community')
@Controller('community')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new community' })
  @ApiResponse({ status: 201, description: 'Community created successfully' })
  async create(@Body() createCommunityDto: CreateCommunityDto) {
    return this.communityService.create(createCommunityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all communities' })
  @ApiResponse({
    status: 200,
    description: 'Communities retrieved successfully',
  })
  async findAll() {
    return this.communityService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get community by ID' })
  @ApiResponse({ status: 200, description: 'Community retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.communityService.findOne(id);
  }
}
