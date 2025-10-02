import { Body, Controller, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { ReserveDTO } from './types';

@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('reserve')
  async reserve(@Body() reserveDTO: ReserveDTO) {
    return await this.bookingsService.reserve(
      reserveDTO.event_id,
      reserveDTO.user_id,
    );
  }
}
