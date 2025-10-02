import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Booking } from './bookings.entity';
import { Event } from '../events/events.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BookingsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}
  async reserve(eventId: number, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const event = await queryRunner.manager.findOne(Event, {
        where: { id: eventId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!event) {
        throw new NotFoundException('Event not found');
      }

      const existing = await queryRunner.manager.findOne(Booking, {
        where: { eventId, userId },
      });

      if (existing) {
        throw new ConflictException('user already booked');
      }

      const bookedCount = await queryRunner.manager.count(Booking, {
        where: { eventId },
      });
      if (bookedCount >= event.totalSeats) {
        throw new ConflictException('Event is  booked');
      }

      const booking = queryRunner.manager.create(Booking, {
        eventId,
        userId,
      });
      const saved = await queryRunner.manager.save(Booking, booking);

      await queryRunner.commitTransaction();
      return saved;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Booking[]> {
    return await this.bookingRepository.find();
  }
  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['event'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with id=${id} not found`);
    }

    return booking;
  }
}
