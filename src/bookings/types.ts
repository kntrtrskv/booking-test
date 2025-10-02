import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class ReserveDTO {
  @IsInt()
  event_id: number;

  @IsString()
  @IsNotEmpty()
  user_id: string;
}
