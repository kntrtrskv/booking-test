import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEventDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  total_seats: number;
}
