import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from '../bookings/bookings.entity';

@Entity({ name: 'events' })
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'total_seats', type: 'int' })
  totalSeats: number;

  @OneToMany(() => Booking, (booking) => booking.event)
  bookings: Booking[];
}
