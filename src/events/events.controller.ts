import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDTO } from './types';

@Controller('events')
export class EventsController {
  constructor(private eventService: EventsService) {}

  @Post('create')
  async reserve(@Body() createEventDTO: CreateEventDTO) {
    return await this.eventService.create(
      createEventDTO.name,
      createEventDTO.total_seats,
    );
  }

  @Get(':id')
  async getEventById(@Param('id') id: number) {
    return await this.eventService.findOne(id);
  }

  @Get('findAll')
  async getAllEvents() {
    return await this.eventService.findAll();
  }
}
