import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDispenserDto {
  @IsString()
  id_v: string;

  @IsNotEmpty()
  @IsNumber()
  number: number;

  @IsNotEmpty()
  @IsString()
  code: string;
}
