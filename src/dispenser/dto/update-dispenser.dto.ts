import { IsNumber, IsString } from 'class-validator';

export class UpdateDispenserDto {
  @IsString()
  id_v?: string;

  @IsNumber()
  number?: number;

  @IsString()
  code?: string;

  @IsString()
  ip?: string;
}
